import CustomError from './CustomError'

export default class IncorrectValues extends CustomError {
  constructor(message = 'Incorrect values.') {
    super(message, 'BAD_REQUEST', 400)
  }
}
