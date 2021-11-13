type ErrorData = { [key: string]: string }

export default class CustomError extends Error {
  constructor(
    public status: number = 500,
    public code: string | number = 'INTERNAL_ERROR',
    public message: string = 'Something went wrong, sorry!',
    public data: ErrorData = {}
  ) {
    super()
  }
}
