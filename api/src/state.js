const _ = require('lodash')
const {readFileSync, writeFileSync} = require('fs')
const log = require('./log').getLogger('state')

const states = {}
const events = {}

const config = {
    schedules: {},
    exclusions: []
}

const loadConfiguration = () => {
    try {
        const serializedConfig = readFileSync('/data/state.json')
        try {
            const savedConfig = JSON.parse(serializedConfig)
            if (savedConfig) {
                config.schedules = savedConfig.schedules
                config.exclusions = savedConfig.exclusions
                log.info('Configuration loaded')
            } else {
                saveConfiguration()
            }
        } catch (error) {
            log.info('Configuration not loaded', error)
        }
    } catch (error) {
        log.info('Configuration not found')
        saveConfiguration()
    }
}

const saveConfiguration = () => {
    writeFileSync('/data/state.json', JSON.stringify(config, null, 2), 'utf8')
    log.debug('Configuration saved')
}

const updateEvents = (key, eventInfo) => {
    events[key] = [...(events[key] || []), eventInfo].slice(-100)
}

const updateState = (key, value) => {
    _.set(states, key, value)
}

const updateSchedule = ({path, value}) => {
    _.merge(config.schedules, _.set({}, path, value))
    saveConfiguration()
}

const updateExclusion = ({zone, bypass}) => {
    const index = config.exclusions.indexOf(zone)
    if (bypass) {
        if (index === -1) {
            config.exclusions.push(zone)
        }
    } else {
        if (index !== -1) {
            config.exclusions.splice(index, 1)
        }
    }
    saveConfiguration()
}

const isArmed = area =>
    states.states.partitions[area].arm

loadConfiguration()

module.exports = {
    states, events, config, updateEvents, updateState, updateSchedule, updateExclusion, isArmed
}
