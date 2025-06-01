const _ = require('lodash')
const log4js = require('log4js')
const logConfig = require('../config/log.json')

const DEFAULT_LEVEL = 'info'

const getCategories = (categories, appenders) => ({
    ...getDefaultCategories(appenders),
    ...getCustomCategories(categories, appenders)
})

const getDefaultCategories = appenders => ({
    default: {appenders, level: DEFAULT_LEVEL}
})

const getCustomCategories = (categories, appenders) =>
    _.mapValues(categories, level => ({
        appenders,
        level
    }))

const getArg = (arg, level) =>
    _.isFunction(arg)
        ? _.flatten([arg(level)])
        : [arg]

const getArgs = (args, level) =>
    _.flatten(_.map(args, arg => getArg(arg, level)))

const getLogger = name => {
    const logger = log4js.getLogger(name)
    const isTrace = () => logger.isTraceEnabled()
    const isDebug = () => logger.isDebugEnabled()
    const isInfo = () => logger.isInfoEnabled()
    const isWarn = () => logger.isWarnEnabled()
    const isError = () => logger.isErrorEnabled()
    const isFatal = () => logger.isFatalEnabled()
    const level = {isTrace, isDebug, isInfo}

    return {
        isTrace,
        isDebug,
        isInfo,
        trace: (...args) => isTrace() && logger.trace(...getArgs(args, level)),
        debug: (...args) => isDebug() && logger.debug(...getArgs(args, level)),
        info: (...args) => isInfo() && logger.info(...getArgs(args, level)),
        warn: (...args) => isWarn() && logger.warn(...getArgs(args, level)),
        error: (...args) => isError() && logger.error(...getArgs(args, level)),
        fatal: (...args) => isFatal() && logger.fatal(...getArgs(args, level))
    }
}

log4js.configure({
    appenders: {
        console: {
            type: 'console'
        }
    },
    categories: getCategories(logConfig, ['console'])
})

module.exports = {
    getLogger
}
