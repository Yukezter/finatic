import CustomError from './CustomError'

export default class NoSymbol extends CustomError {
  constructor() {
    super(400, 'No symbol provided')
  }
}
