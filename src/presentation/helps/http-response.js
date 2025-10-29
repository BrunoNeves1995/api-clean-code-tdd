const { ServerError, UnauthorizedError } = require('../error')

module.exports = class httpResponse {
  static badRequest (error) {
    return {
      statusCode: 400,
      body: error
    }
  }

  static serverError (paramName) {
    return {
      statusCode: 500,
      body: new ServerError()
    }
  }

  static unauthorizedError (paramName) {
    return {
      statusCode: 401,
      body: new UnauthorizedError()
    }
  }

  static ok (data) {
    return {
      statusCode: 200,
      body: data

    }
  }
}
