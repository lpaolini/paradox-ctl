const timestamp = () =>
    new Date().toISOString()

const logger = {
    // eslint-disable-next-line no-console
    debug: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error
}

const log = (level, args) =>
    logger[level](`${timestamp()} [${level.toUpperCase()}]`, ...args)

module.exports = {
    debug: (...args) => log('debug', args),
    info: (...args) => log('info', args),
    warn: (...args) => log('warn', args),
    error: (...args) => log('error', args)
}
