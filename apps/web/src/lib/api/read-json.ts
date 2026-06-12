export class ApiResponseParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiResponseParseError";
  }
}

type ReadJsonOptions = {
  allowEmpty?: boolean;
};

function summarizeBody(body: string) {
  const normalized = body.replace(/\s+/g, " ").trim();
  return normalized.length > 160
    ? `${normalized.slice(0, 160)}...`
    : normalized;
}

export async function readJsonResponse<T>(
  response: Response,
  options: ReadJsonOptions = {},
) {
  const rawText = await response.text();
  const body = rawText.trim();

  if (!response.ok) {
    throw new Error(
      body || `요청에 실패했습니다. 상태 코드: ${response.status}`,
    );
  }

  if (!body) {
    if (options.allowEmpty) {
      return null as T;
    }

    throw new ApiResponseParseError("API가 비어 있는 응답을 반환했습니다.");
  }

  const contentType = response.headers.get("content-type");
  if (contentType && !contentType.toLowerCase().includes("application/json")) {
    throw new ApiResponseParseError(
      `JSON 응답이 아닙니다. content-type=${contentType}, body=${summarizeBody(body)}`,
    );
  }

  try {
    return JSON.parse(body) as T;
  } catch {
    throw new ApiResponseParseError(
      `JSON 파싱에 실패했습니다. body=${summarizeBody(body)}`,
    );
  }
}
