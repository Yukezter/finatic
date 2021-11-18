import CustomError from './CustomError'

export default class IncorrectValues extends CustomError {
  constructor() {
    super(400, 'Incorrect Values')
  }
}
