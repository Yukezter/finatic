type ErrorData = { [key: string]: string }

export default class CustomError extends Error {
  constructor(
    public message: string,
    public code: string | number = 'INTERNAL_ERROR',
    public status: number,
    public data: ErrorData = {}
  ) {
    super()
  }
}
