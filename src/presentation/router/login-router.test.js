const MissingParamError = require('../helps/missing-param-error')
const UnauthorizedError = require('../helps/unauthorized-error')
const LoginRouter = require('./login-router')

const makeSut = () => {
  class AuthUseCasespySpy {
    auth (email, password) {
      this.email = email
      this.password = password
    }
  }

  const authUseCasespySpy = new AuthUseCasespySpy()
  const sut = new LoginRouter(authUseCasespySpy)
  return {
    sut,
    authUseCasespySpy
  }
}

describe('lOGIN ROUTER', () => {
  test('should return 400 if no email is provided -> deve retornar 400 se nenhum e-mail for fornecido', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('should return 400 if no passwod is provided -> deve retornar 400 se nenhum senha for fornecido', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('should return 500 if no httpRequest is provided -> deve retornar 500 se nenhum request for fornecido', () => {
    const { sut } = makeSut()
    const httpResponse = sut.route()
    expect(httpResponse.statusCode).toBe(500)
  })

  test('should return 500 if httpRequest has no body -> deve retornar 500 se httpRequest não tiver corpo', () => {
    const { sut } = makeSut()
    const httpRequest = {}
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })

  test('should call authUseCasespy with correct params -> deve chamar authUseCasespy com os parâmetros corretos', () => {
    const { authUseCasespySpy, sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com',
        password: 'any_password'
      }
    }

    sut.route(httpRequest)
    expect(authUseCasespySpy.email).toBe(httpRequest.body.email)
    expect(authUseCasespySpy.password).toBe(httpRequest.body.password)
  })

  test('should return 401 when credentials invalid are provided -> deve retornar 401 quando as credenciais inválidos forem fornecidos', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'invalid@gmail.com',
        password: 'invalid_password'
      }
    }

    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  test('should return 500 if no AuthUseCase is provided -> deve retornar 500 quando as credenciais inválidos forem fornecidos', () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com',
        password: 'any_password'
      }
    }

    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })

  test('should return 500 if no AuthUseCase has no auth method -> deve retornar 500 se o AuthUseCase nao tiver metodo de autenticação', () => {
    const sut = new LoginRouter({})
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com',
        password: 'any_password'
      }
    }

    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })
})
