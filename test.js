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

    register('B', () => ({
      f() {
        return 'This is B.f'
      }
    }))

    expect(A.f()).toEqual('This is B.f')
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
    }).toThrow(Error);
  })
})
