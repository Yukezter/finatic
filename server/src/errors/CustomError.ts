type ErrorData = { [key: string]: string }

export default class CustomError extends Error {
  constructor(
    public status: number = 500,
    public statusText: string = 'Internal Server Error',
    public data: ErrorData = {}
  ) {
    super(statusText)
  }
}
