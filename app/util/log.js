module.exports = true ? (...log) => console.log(new Date().toTimeString(), ...log) : () => {};
