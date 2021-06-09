declare namespace Express {
  export interface Response {
    cache: {
      data: any
      writeHead: any
      write: any
      end: any
    }
  }
}
