import CustomError from './CustomError'

export default class ResourceNotFound extends CustomError {
  constructor() {
    super(404, 'NOT_FOUND', 'Resource not found.')
  }
}
