import CustomError from './CustomError'

export default class NotFound extends CustomError {
  constructor() {
    super(404, 'Not found')
  }
}
