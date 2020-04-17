const waterpump = require('./index')

describe('waterpump', () => {
  it('should inject a single module', () => {
    const { register } = waterpump()

    const iA = () => ({
      f() {
        return 'This is A.f'
      }
    })

    const A = register('A', iA)

    expect(A.f()).toEqual('This is A.f')
  })

  it('should inject two modules, where A depends on B', () => {
    const { register } = waterpump()

    const A = register('A', (ports) => ({
      f() {
        return ports.B.f()
      }
    }))

    const B = register('B', (ports) => ({
      f() {
        return 'This is B.f'
      }
    }))

    expect(A.f()).toEqual('This is B.f')
  })

  it('should expode when A depends on B but B was not injected', () => {
    const { register } = waterpump()

    const A = register('A', (ports) => ({
      f() {
        return ports.B.f()
      }
    }))

    expect(() => {
      A.f()
    }).toThrowError(`Cannot read property 'f' of undefined`)
  })

  it('should inject two modules, where with circular dependency', () => {
    const { register } = waterpump()

    const A = register('A', (ports) => ({
      f() {
        return ports.B.f()
      },
      g() {
        return 'This is A.g'
      }
    }))

    register('B', (ports) => ({
      f() {
        return ports.A.g()
      }
    }))

    expect(A.f()).toEqual('This is A.g')
  })

  it('should NOT be able to inject the same module twice', () => {
    const { register } = waterpump()

    register('A', () => ({}))

    expect(() => {
      register('A', () => ({}))
    }).toThrowError('Module A already injected');
  })

  describe('mocks', () => {
    it('should ignore any accessed path', () => {
      const { mock: { ignore } } = waterpump()
      expect(
        ignore
          .a
          .b({ a: 234 })[123]
          .stuff()
          .lol
          .oki()
          .then('nevermind')
          .that[0]
          .will['work']
          .well
          .well
      )
    })

    it('should forward values to next callback', () => {
      const { mock: { callback } } = waterpump()
      const mod = {
        f: callback(null, 1, 2, 'joey')
      }

      mod.f('ignored', 'more_ignored', (err, one, two, joey) => {
        expect(err).toBe(null)
        expect(one).toBe(1)
        expect(two).toBe(2)
        expect(joey).toBe('joey')
      })
    })

    it('should forward err to next callback', () => {
      const { mock: { callback } } = waterpump()

      const errorMessage = `${Math.floor(Math.random() * 1000)}`
      const mod = {
        f: callback(new Error(errorMessage))
      }

      mod.f('ignored', 'more_ignored', (err, ...values) => {
        expect(err.message).toEqual(errorMessage)
      })
    })
  })
})
