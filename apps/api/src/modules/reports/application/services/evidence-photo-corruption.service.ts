import { Injectable, Logger } from "@nestjs/common";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import sharp from "sharp";

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const storageBucket =
  process.env.SUPABASE_STORAGE_BUCKET ??
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ??
  "evidence-photos";
const displayPathPrefix = "report-views/";

interface ImageAnalysis {
  strongestRow: number;
  strongestColumn: number;
  darkestSide: "top" | "right" | "bottom" | "left";
}

@Injectable()
export class EvidencePhotoCorruptionService {
  private readonly logger = new Logger(EvidencePhotoCorruptionService.name);
  private supabase: SupabaseClient | null = null;

  private getClient() {
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error(
        "Supabase Storage 처리용 환경 변수가 없습니다. SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY를 설정해 주세요.",
      );
    }

    if (!this.supabase) {
      this.supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
    }

    return this.supabase;
  }

  async createDisplayVariant(sourcePath: string, reportId: string) {
    const supabase = this.getClient();
    const { data, error } = await supabase.storage.from(storageBucket).download(sourcePath);

    if (error || !data) {
      throw new Error(`증거 이미지 다운로드에 실패했습니다: ${error?.message ?? "unknown error"}`);
    }

    const sourceBuffer = Buffer.from(await data.arrayBuffer());
    const variantBuffer = await this.renderCorruptedVariant(sourceBuffer, reportId);
    const displayPath = this.buildDisplayPath(sourcePath, reportId);

    const { error: uploadError } = await supabase.storage.from(storageBucket).upload(displayPath, variantBuffer, {
      contentType: "image/png",
      upsert: true,
      cacheControl: "3600",
    });

    if (uploadError) {
      throw new Error(`열람용 오염 사본 업로드에 실패했습니다: ${uploadError.message}`);
    }

    return displayPath;
  }

  async removeDisplayVariant(path: string | null | undefined) {
    if (!path) {
      return;
    }

    const supabase = this.getClient();
    const { error } = await supabase.storage.from(storageBucket).remove([path]);

    if (error) {
      this.logger.warn(`오염 사본 정리에 실패했습니다: ${path} (${error.message})`);
    }
  }

  private buildDisplayPath(sourcePath: string, reportId: string) {
    const sanitizedReportId = reportId.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
    const sourceDir = sourcePath.includes("/") ? sourcePath.split("/").slice(0, -1).join("/") : "reports";
    return `${displayPathPrefix}${sourceDir}/${sanitizedReportId}.png`;
  }

  private async renderCorruptedVariant(sourceBuffer: Buffer, reportId: string) {
    const baseImage = sharp(sourceBuffer).rotate();
    const metadata = await baseImage.metadata();

    if (!metadata.width || !metadata.height) {
      throw new Error("이미지 크기를 분석할 수 없습니다.");
    }

    const width = metadata.width;
    const height = metadata.height;
    const analysis = await this.analyzeImage(sourceBuffer);
    const seed = this.hashSeed(reportId);
    const preset = seed % 3;
    const lineOverlay = this.createLineDropoutOverlay(width, height, analysis, seed);
    const scanNoiseOverlay = this.createScanNoiseOverlay(width, height, seed);

    const composites: sharp.OverlayOptions[] = [
      {
        input: Buffer.from(lineOverlay),
        top: 0,
        left: 0,
      },
      {
        input: Buffer.from(scanNoiseOverlay),
        top: 0,
        left: 0,
      },
    ];

    if (preset === 0) {
      composites.push(await this.createEdgeMeltComposite(baseImage, width, height, analysis, seed));
    } else if (preset === 1) {
      composites.push(await this.createEchoRepeatComposite(baseImage, width, height, analysis, seed));
    } else {
      composites.push(await this.createEdgeMeltComposite(baseImage, width, height, analysis, seed));
      composites.push(await this.createEchoRepeatComposite(baseImage, width, height, analysis, seed + 17));
    }

    return baseImage
      .clone()
      .composite(composites)
      .png({
        compressionLevel: 9,
      })
      .toBuffer();
  }

  private async analyzeImage(sourceBuffer: Buffer): Promise<ImageAnalysis> {
    const sample = await sharp(sourceBuffer)
      .rotate()
      .resize(64, 64, {
        fit: "inside",
      })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const width = sample.info.width;
    const height = sample.info.height;
    const luminance: number[] = [];

    for (let index = 0; index < sample.data.length; index += 3) {
      const red = sample.data[index];
      const green = sample.data[index + 1];
      const blue = sample.data[index + 2];
      luminance.push(red * 0.299 + green * 0.587 + blue * 0.114);
    }

    const rowScores = new Array(height).fill(0);
    const columnScores = new Array(width).fill(0);

    for (let y = 0; y < height; y += 1) {
      for (let x = 1; x < width; x += 1) {
        rowScores[y] += Math.abs(luminance[y * width + x] - luminance[y * width + x - 1]);
      }
    }

    for (let x = 0; x < width; x += 1) {
      for (let y = 1; y < height; y += 1) {
        columnScores[x] += Math.abs(luminance[y * width + x] - luminance[(y - 1) * width + x]);
      }
    }

    const rowStart = Math.max(4, Math.floor(height * 0.2));
    const rowEnd = Math.max(rowStart + 1, Math.floor(height * 0.8));
    const strongestRow = this.findPeakIndex(rowScores, rowStart, rowEnd);

    const columnStart = Math.max(4, Math.floor(width * 0.15));
    const columnEnd = Math.max(columnStart + 1, Math.floor(width * 0.85));
    const strongestColumn = this.findPeakIndex(columnScores, columnStart, columnEnd);

    const band = Math.max(2, Math.floor(Math.min(width, height) * 0.12));
    const sideBrightness = {
      top: this.averageLuminance(luminance, width, height, { x: 0, y: 0, width, height: band }),
      right: this.averageLuminance(luminance, width, height, {
        x: width - band,
        y: 0,
        width: band,
        height,
      }),
      bottom: this.averageLuminance(luminance, width, height, {
        x: 0,
        y: height - band,
        width,
        height: band,
      }),
      left: this.averageLuminance(luminance, width, height, { x: 0, y: 0, width: band, height }),
    };

    const darkestSide = (Object.entries(sideBrightness).sort((a, b) => a[1] - b[1])[0]?.[0] ??
      "left") as ImageAnalysis["darkestSide"];

    return {
      strongestRow,
      strongestColumn,
      darkestSide,
    };
  }

  private findPeakIndex(values: number[], start: number, end: number) {
    let peakIndex = start;
    let peakValue = Number.NEGATIVE_INFINITY;

    for (let index = start; index < end; index += 1) {
      if (values[index] > peakValue) {
        peakValue = values[index];
        peakIndex = index;
      }
    }

    return peakIndex;
  }

  private averageLuminance(
    luminance: number[],
    width: number,
    height: number,
    rect: { x: number; y: number; width: number; height: number },
  ) {
    let total = 0;
    let count = 0;

    for (let y = rect.y; y < Math.min(height, rect.y + rect.height); y += 1) {
      for (let x = rect.x; x < Math.min(width, rect.x + rect.width); x += 1) {
        total += luminance[y * width + x];
        count += 1;
      }
    }

    return count === 0 ? 0 : total / count;
  }

  private createLineDropoutOverlay(width: number, height: number, analysis: ImageAnalysis, seed: number) {
    const normalizedRow = analysis.strongestRow / 64;
    const y = Math.max(height * 0.12, normalizedRow * height - height * 0.018);
    const lineHeight = Math.max(8, Math.round(height * (0.018 + (seed % 3) * 0.004)));
    const x = width * (0.12 + ((seed >> 3) % 24) / 100);
    const lineWidth = width * (0.38 + ((seed >> 6) % 18) / 100);
    const secondaryWidth = lineWidth * 0.46;
    const secondaryX = Math.min(width - secondaryWidth - 12, x + lineWidth * 0.28);
    const secondaryY = Math.min(height - 8, y + lineHeight + Math.max(6, height * 0.008));

    return `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="blur">
            <feGaussianBlur stdDeviation="${Math.max(1.2, width * 0.0014)}" />
          </filter>
        </defs>
        <rect x="${x}" y="${y}" width="${lineWidth}" height="${lineHeight}" rx="${lineHeight / 2}" fill="rgba(9,11,14,0.52)" filter="url(#blur)" />
        <rect x="${secondaryX}" y="${secondaryY}" width="${secondaryWidth}" height="${Math.max(5, lineHeight * 0.72)}" rx="${lineHeight / 2}" fill="rgba(9,11,14,0.36)" filter="url(#blur)" />
      </svg>
    `;
  }

  private createScanNoiseOverlay(width: number, height: number, seed: number) {
    const opacityA = 0.035 + ((seed >> 4) % 4) * 0.008;
    const opacityB = opacityA * 0.65;

    return `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="rgba(255,255,255,0.05)" />
            <stop offset="100%" stop-color="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#fade)" opacity="0.12" />
        ${Array.from({ length: 7 }, (_, index) => {
          const y = ((index + 1) * height) / 8;
          const strokeOpacity = index % 2 === 0 ? opacityA : opacityB;
          return `<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="rgba(255,255,255,${strokeOpacity})" stroke-width="1" />`;
        }).join("")}
      </svg>
    `;
  }

  private async createEdgeMeltComposite(
    baseImage: sharp.Sharp,
    width: number,
    height: number,
    analysis: ImageAnalysis,
    seed: number,
  ): Promise<sharp.OverlayOptions> {
    const stripWidth = Math.max(24, Math.round(width * 0.12));
    const stripHeight = Math.max(24, Math.round(height * 0.14));
    const y = Math.min(
      Math.max(0, Math.round((analysis.strongestRow / 64) * height) - Math.round(stripHeight / 2)),
      Math.max(0, height - stripHeight),
    );

    const region =
      analysis.darkestSide === "left"
        ? { left: 0, top: y, width: stripWidth, height: stripHeight }
        : analysis.darkestSide === "right"
          ? { left: Math.max(0, width - stripWidth), top: y, width: stripWidth, height: stripHeight }
          : analysis.darkestSide === "top"
            ? {
                left: Math.min(
                  Math.max(0, Math.round((analysis.strongestColumn / 64) * width) - Math.round(stripWidth / 2)),
                  Math.max(0, width - stripWidth),
                ),
                top: 0,
                width: stripWidth,
                height: stripHeight,
              }
            : {
                left: Math.min(
                  Math.max(0, Math.round((analysis.strongestColumn / 64) * width) - Math.round(stripWidth / 2)),
                  Math.max(0, width - stripWidth),
                ),
                top: Math.max(0, height - stripHeight),
                width: stripWidth,
                height: stripHeight,
              };

    const extracted = await baseImage
      .clone()
      .extract(region)
      .modulate({ brightness: 0.78, saturation: 0.55 })
      .blur(Math.max(8, Math.round(Math.min(width, height) * 0.012)))
      .linear(0.88, -10)
      .removeAlpha()
      .ensureAlpha(0.34)
      .png()
      .toBuffer();

    const inwardOffset = Math.max(8, Math.round(Math.min(width, height) * (0.018 + (seed % 3) * 0.006)));

    return {
      input: extracted,
      left:
        analysis.darkestSide === "left"
          ? inwardOffset
          : analysis.darkestSide === "right"
            ? Math.max(0, width - region.width - inwardOffset)
            : region.left,
      top:
        analysis.darkestSide === "top"
          ? inwardOffset
          : analysis.darkestSide === "bottom"
            ? Math.max(0, height - region.height - inwardOffset)
            : region.top,
    };
  }

  private async createEchoRepeatComposite(
    baseImage: sharp.Sharp,
    width: number,
    height: number,
    analysis: ImageAnalysis,
    seed: number,
  ): Promise<sharp.OverlayOptions> {
    const patchWidth = Math.max(28, Math.round(width * 0.16));
    const patchHeight = Math.max(18, Math.round(height * 0.1));
    const sourceLeft = Math.min(
      Math.max(0, Math.round((analysis.strongestColumn / 64) * width) - Math.round(patchWidth / 2)),
      Math.max(0, width - patchWidth),
    );
    const sourceTop = Math.min(
      Math.max(0, Math.round((analysis.strongestRow / 64) * height) - Math.round(patchHeight / 2)),
      Math.max(0, height - patchHeight),
    );

    const extracted = await baseImage
      .clone()
      .extract({
        left: sourceLeft,
        top: sourceTop,
        width: patchWidth,
        height: patchHeight,
      })
      .blur(Math.max(2, Math.round(Math.min(width, height) * 0.0024)))
      .removeAlpha()
      .ensureAlpha(0.16)
      .png()
      .toBuffer();

    const horizontalShift = Math.max(12, Math.round(width * (0.018 + ((seed >> 5) % 4) * 0.008)));
    const verticalShift = Math.max(8, Math.round(height * (0.012 + ((seed >> 7) % 3) * 0.007)));

    return {
      input: extracted,
      left: Math.min(Math.max(0, sourceLeft + horizontalShift), Math.max(0, width - patchWidth)),
      top: Math.min(Math.max(0, sourceTop + verticalShift), Math.max(0, height - patchHeight)),
    };
  }

  private hashSeed(input: string) {
    let hash = 2166136261;

    for (let index = 0; index < input.length; index += 1) {
      hash ^= input.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }

    return Math.abs(hash >>> 0);
  }
}
