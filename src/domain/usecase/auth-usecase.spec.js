const { MissingParamError } = require('../../utils/errors')

class AuthUseCase {
  async auth (email, password) {
    if (!email) {
      return new MissingParamError('email')
    }

    if (!password) {
      return new MissingParamError('password')
    }
  }
}

describe('AUTH USECASE', () => {
  test('should return throw if no email is not provided', async () => {
    const sut = new AuthUseCase()
    const acesssToken = await sut.auth()

    expect(acesssToken).toEqual(new MissingParamError('email'))
  })

  test('should return throw if no password is not provided', async () => {
    const sut = new AuthUseCase()
    const acesssToken = await sut.auth('any_email@email.com')

    expect(acesssToken).toEqual(new MissingParamError('password'))
  })
})
