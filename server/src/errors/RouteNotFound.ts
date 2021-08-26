import CustomError from './CustomError'

export default class RouteNotFound extends CustomError {
  constructor(originalUrl: string) {
    super(`${originalUrl} does not exist.`, 'NOT_FOUND', 404)
  }
}
