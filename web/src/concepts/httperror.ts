export const HttpCode = {
  OK: 200,
  Created: 201,
  NoContent: 204,
  MovedPermanently: 301,
  Found: 302,
  NotModified: 304,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  Gone: 410,
  ServerError: 500
} as const

export type HttpCode = typeof HttpCode[keyof typeof HttpCode]

export class HttpError extends Error {
  status: HttpCode | number

  constructor(status: HttpCode | number, message?: string) {
    // 'Error' breaks prototype chain here
    super(message)
    this.status = status
    // restore prototype chain
    const actualProto = new.target.prototype

    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto)
    } else {
      // @ts-ignore
      this.__proto__ = actualProto
    }
  }

  toString(): string {
    return `HTTP error ${this.status}: ${this.message}`
  }
}
