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

export class InvalidParams extends CustomError {
  constructor() {
    super('Incorrect Values', 'BAD_REQUEST', 400)
  }
}

export class ResourceNotFound extends CustomError {
  constructor() {
    super('No Resource Found', 'NOT_FOUND', 404)
  }
}

export class RouteNotFoundError extends CustomError {
  constructor(originalUrl: string) {
    super(`${originalUrl} does not exist.`, 'NOT_FOUND', 404)
  }
}
