module.exports = () => {
  const mods = {}

  return {
    register: (name, modF) => {
      if (mods[name]) {
        throw new Error(`Module ${name} already injected`)
      }
      return mods[name] = modF(mods)
    }
  }
}
