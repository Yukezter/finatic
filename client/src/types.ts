export type SearchState = {
  inputValue: string
  options: any[]
}

export enum SearchActionKind {
  UPDATE_INPUT = 'UPDATE_INPUT',
  UPDATE_OPTIONS = 'UPDATE_OPTIONS',
  CLEAR = 'CLEAR',
}

export interface SearchAction {
  type: SearchActionKind
  payload: any
}
