const { MissingParamError } = require('../../utils/errors')

class AuthUseCase {
  async auth (email) {
    if (!email) {
      return new MissingParamError('email')
    }
  }
}

describe('AUTH USECASE', () => {
  test('should return throw if no email is not provided', async () => {
    const sut = new AuthUseCase()
    const acesssToken = await sut.auth()

    expect(acesssToken).toEqual(new MissingParamError('email'))
  })
})
