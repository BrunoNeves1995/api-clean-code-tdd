const { ServerError, UnauthorizedError } = require('../error')
const { InvalidParamError, MissingParamError } = require('../../utils/errors')
const LoginRouter = require('./login-router')

const makeSut = () => {
  const authUseCasespySpy = makeAuthCase()
  const emailValidatorSpy = makeEmailValidator()
  authUseCasespySpy.accessToken = 'valid_acesss_token'
  const sut = new LoginRouter(authUseCasespySpy, emailValidatorSpy)
  return {
    sut,
    authUseCasespySpy,
    emailValidatorSpy
  }
}

const makeEmailValidator = () => {
  class EmailValidatorSpy {
    isValid (email) {
      this.email = email
      return this.isEmailValid
    }
  }

  const emailValidatorSpy = new EmailValidatorSpy()
  emailValidatorSpy.isEmailValid = true
  return emailValidatorSpy
}

const makeAuthCase = () => {
  class AuthUseCasespySpy {
    async auth (email, password) {
      this.email = email
      this.password = password
      return this.accessToken
    }
  }
  return new AuthUseCasespySpy()
}

const makeAuthUseCaseWithError = () => {
  class AuthUseCasespySpy {
    async auth () {
      throw new Error()
    }
  }
  return new AuthUseCasespySpy()
}

const makeEmailValidatorWithError = () => {
  class EmailValidatorSpy {
    isValid () {
      throw new Error()
    }
  }
  return new EmailValidatorSpy()
}

describe('lOGIN ROUTER', () => {
  test('should return 400 if no email is provided -> deve retornar 400 se nenhum e-mail for fornecido', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('should return 400 if no passwod is provided -> deve retornar 400 se nenhum senha for fornecido', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('should return 500 if no httpRequest is provided -> deve retornar 500 se nenhum request for fornecido', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should return 500 if httpRequest has no body -> deve retornar 500 se httpRequest não tiver corpo', async () => {
    const { sut } = makeSut()
    const httpRequest = {}
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should call authUseCasespy with correct params -> deve chamar authUseCasespy com os parâmetros corretos', async () => {
    const { authUseCasespySpy, sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com',
        password: 'any_password'
      }
    }

    await sut.route(httpRequest)
    expect(authUseCasespySpy.email).toBe(httpRequest.body.email)
    expect(authUseCasespySpy.password).toBe(httpRequest.body.password)
  })

  test('should return 401 when credentials invalid are provided -> deve retornar 401 quando as credenciais inválidos forem fornecidos', async () => {
    const { sut, authUseCasespySpy } = makeSut()
    authUseCasespySpy.accessToken = null
    const httpRequest = {
      body: {
        email: 'invalid@gmail.com',
        password: 'invalid_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  test('should return 200 when credentials valid are provided -> deve retornar 200 quando as credenciais validas forem fornecidos', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'valid@gmail.com',
        password: 'valid_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
  })

  test('should return 200 when credentials valid are provided -> deve retornar 200 quando as credenciais validas forem fornecidos', async () => {
    const { sut, authUseCasespySpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'valid@gmail.com',
        password: 'valid_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    console.log('aqui => ', authUseCasespySpy.data)
    expect(httpResponse.body.accessToken).toEqual(authUseCasespySpy.accessToken)
  })

  test('should return 500 if no AuthUseCase is provided -> deve retornar 500 quando as credenciais inválidos forem fornecidos', async () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should return 500 if AuthUseCase throws -> deve retornar 500 se AuthUseCase lançar um erro', async () => {
    const authUseCasespySpy = makeAuthUseCaseWithError()
    const sut = new LoginRouter(authUseCasespySpy)
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })

  test('should return 400 if an invalid email is provided -> deve retornar 400 se um e-mail fornecido é invalido', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    emailValidatorSpy.isEmailValid = false
    const httpRequest = {
      body: {
        email: 'invalid@.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('should return 500 if no EmailValidator is provided -> deve retornar 500 quando as credenciais emailValidator nao for fornecidos', async () => {
    const authUseCasespySpy = makeAuthCase()
    const sut = new LoginRouter(authUseCasespySpy, {})
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should return 500 if no EmailValidator has no provided -> deve retornar 500 quando o metodoemailValidator nao for fornecidos', async () => {
    const authUseCasespySpy = makeAuthCase()
    const sut = new LoginRouter(authUseCasespySpy, {})
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should return 500 if EmailValidator throws -> deve retornar 500 se EmailValidator lançar um erro', async () => {
    const authUseCasespySpy = makeAuthCase()
    const emailValidatorSpy = makeEmailValidatorWithError()
    const sut = new LoginRouter(authUseCasespySpy, emailValidatorSpy)
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })

  test('should call EmailValidator with correct email -> deve chamar emailValidator com o email correto', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com',
        password: 'any_password'
      }
    }

    await sut.route(httpRequest)
    expect(emailValidatorSpy.email).toBe(httpRequest.body.email)
  })
})
