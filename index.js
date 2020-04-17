const ignore = new Proxy(() => {}, {
  get: () => ignore,
  apply: () => ignore
})

const callback = (err, ...params) => (...a) => a[a.length-1](err, ...params)

module.exports = () => {
  const mods = {}

  return {
    register: (name, modF) => {
      if (mods[name]) {
        throw new Error(`Module ${name} already injected`)
      }
      return mods[name] = modF(mods)
    },

    mock: {
      ignore,
      callback
    }
  }
}
