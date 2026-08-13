export class EditorFieldError extends Error {
  constructor(readonly errors: Record<string, string>) {
    super("Editor validation failed");
  }
}