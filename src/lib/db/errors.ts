export const DATABASE_UNAVAILABLE_MESSAGE =
  "The content database is temporarily unavailable. Please try again in a moment.";

export const DATA_SOURCE_UNAVAILABLE_ERROR_NAME = "DataSourceUnavailableError";

/**
 * Raised when the database cannot be reached: DATABASE_URL is missing,
 * the MySQL/MariaDB server is down, credentials are rejected, or the
 * connection drops. Distinct identity is preserved across the client
 * boundary via the stable `name` value, so error boundaries can show a
 * targeted message without leaking connection details.
 */
export class DataSourceUnavailableError extends Error {
  constructor(
    message: string = DATABASE_UNAVAILABLE_MESSAGE,
    options?: ErrorOptions
  ) {
    super(message, options);
    this.name = DATA_SOURCE_UNAVAILABLE_ERROR_NAME;
  }
}

const CONNECTION_ERROR_CODES = new Set([
  "ECONNREFUSED",
  "ECONNRESET",
  "ENOTFOUND",
  "ETIMEDOUT",
  "EHOSTUNREACH",
  "ENETUNREACH",
  "EPIPE",
  "ER_ACCESS_DENIED_ERROR",
  "ER_BAD_DB_ERROR",
  "ER_DBACCESS_DENIED_ERROR",
  "ER_CON_COUNT_ERROR",
  "ER_HOST_NOT_PRIVILEGED",
  "ER_SERVER_SHUTDOWN",
  "PROTOCOL_CONNECTION_LOST",
]);

const CONNECTION_ERROR_PATTERNS = [
  /can't reach database server/i,
  /connection[ -]?refused/i,
  /connection[ -]?lost/i,
  /could not connect to database/i,
  /getaddrinfo enotfound/i,
  /access denied for user/i,
  /unknown database/i,
  /database .* does not exist/i,
  /authentication failed/i,
  /p1000$/,
  /p1001$/,
  /p1002$/,
  /p1003$/,
];

/**
 * Action failure payload for admin server actions when the database is
 * unreachable. Kept as a return value, never thrown, so forms can show
 * the message through their regular error banner.
 */
export function dataSourceFailure(): { ok: false; error: string } {
  return { ok: false, error: DATABASE_UNAVAILABLE_MESSAGE };
}

/**
 * Returns true when the error represents an unreachable data source
 * (missing configuration, refused/timeout connection, invalid or
 * rejected credentials, missing database). The cause chain is walked so
 * wrapped driver/engine errors are still recognized.
 */
export function isDataSourceUnavailableError(error: unknown): boolean {
  if (error instanceof DataSourceUnavailableError) return true;

  const visited = new Set<object>();
  let current: unknown = error;

  while (typeof current === "object" && current !== null) {
    if (visited.has(current)) break;
    visited.add(current);

    if (current instanceof Error) {
      const error = current;
      if (error.name === DATA_SOURCE_UNAVAILABLE_ERROR_NAME) return true;
      const code = (error as Error & { code?: unknown }).code;
      if (
        typeof code === "string" &&
        CONNECTION_ERROR_CODES.has(code.toUpperCase())
      ) {
        return true;
      }
      const message = error.message;
      if (CONNECTION_ERROR_PATTERNS.some((pattern) =>
        pattern.test(message)
      )) {
        return true;
      }
    }

    current = (current as Error & { cause?: unknown }).cause;
  }

  return false;
}