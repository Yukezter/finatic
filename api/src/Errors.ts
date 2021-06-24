/* eslint-disable max-classes-per-file */
type ErrorData = { [key: string]: any }

export class CustomError extends Error {
  constructor(
    public message: string,
    public code: string | number = 'INTERNAL_ERROR',
    public status: number,
    public data: ErrorData = {}
  ) {
    super()
  }
}

export class IncorrectValues extends CustomError {
  constructor(message = 'Incorrect values.') {
    super(message, 'BAD_REQUEST', 400)
  }
}

export class ResourceNotFound extends CustomError {
  constructor() {
    super('Resource not found.', 'NOT_FOUND', 404)
  }
}

export class RouteNotFound extends CustomError {
  constructor(originalUrl: string) {
    super(`${originalUrl} does not exist.`, 'NOT_FOUND', 404)
  }
}
