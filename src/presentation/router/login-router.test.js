class LoginRouter {
  route (httpRequest) {
    if (!httpRequest.email) {
      return {
        statusCode: 400
      }
    }
  }
}

describe('lOGIN ROUTER', () => {
  test('should return 400 if no email is provided -> deve retornar 400 se nenhum e-mail for fornecido', () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
})
