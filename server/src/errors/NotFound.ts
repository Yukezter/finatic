import CustomError from './CustomError'

export default class NotFound extends CustomError {
  constructor(message: string) {
    super(404, 'NOT_FOUND', message)
  }
}
