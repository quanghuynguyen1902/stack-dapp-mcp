import { getConfig } from "./config.js";

export class HiroApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body: string,
  ) {
    super(`Hiro API error ${status}: ${statusText}`);
    this.name = "HiroApiError";
  }
}

function buildHeaders(): Record<string, string> {
  const { apiKey } = getConfig();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (apiKey) {
    headers["X-API-Key"] = apiKey;
  }
  return headers;
}

export async function hiroGet<T = unknown>(path: string): Promise<T> {
  const { baseUrl } = getConfig();
  const url = `${baseUrl}${path}`;
  const res = await fetch(url, { headers: buildHeaders() });
  if (!res.ok) {
    throw new HiroApiError(res.status, res.statusText, await res.text());
  }
  return res.json() as Promise<T>;
}

export async function hiroPost<T = unknown>(
  path: string,
  body: unknown,
): Promise<T> {
  const { baseUrl } = getConfig();
  const url = `${baseUrl}${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new HiroApiError(res.status, res.statusText, await res.text());
  }
  return res.json() as Promise<T>;
}
