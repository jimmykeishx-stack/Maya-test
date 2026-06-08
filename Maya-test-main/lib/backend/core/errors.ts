export class BackendError extends Error {
  readonly status: number;
  readonly details?: Record<string, string[]>;

  constructor(message: string, status = 400, details?: Record<string, string[]>) {
    super(message);
    this.name = "BackendError";
    this.status = status;
    this.details = details;
  }
}
