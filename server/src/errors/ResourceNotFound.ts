import CustomError from './CustomError'

export default class ResourceNotFound extends CustomError {
  constructor() {
    super('Resource not found.', 'NOT_FOUND', 404)
  }
}
