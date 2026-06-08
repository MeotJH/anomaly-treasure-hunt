import "./load-env";
import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

function createCorsOriginMatcher() {
  const configuredOrigins = (process.env.CORS_ALLOWED_ORIGINS ?? "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (configuredOrigins.includes("*")) {
    return true;
  }

  return (requestOrigin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
    if (!requestOrigin) {
      callback(null, true);
      return;
    }

    const isAllowed = configuredOrigins.some((allowedOrigin) => {
      if (allowedOrigin === requestOrigin) {
        return true;
      }

      if (!allowedOrigin.includes("*")) {
        return false;
      }

      const [prefix, ...suffixParts] = allowedOrigin.split("*");
      const suffix = suffixParts.join("*");

      return requestOrigin.startsWith(prefix) && requestOrigin.endsWith(suffix);
    });

    callback(isAllowed ? null : new Error(`Origin not allowed by CORS: ${requestOrigin}`), isAllowed);
  };
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: createCorsOriginMatcher(),
      credentials: true,
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = Number(process.env.PORT ?? 4000);

  await app.listen(port, "0.0.0.0");
  console.log(`API listening on http://0.0.0.0:${port}`);
}

bootstrap();
