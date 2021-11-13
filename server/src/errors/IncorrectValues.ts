import CustomError from './CustomError'

export default class IncorrectValues extends CustomError {
  constructor(message = 'Incorrect values.') {
    super(400, 'BAD_REQUEST', message)
  }
}
