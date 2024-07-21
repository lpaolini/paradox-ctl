const _ = require('lodash')
const log = require('./log')
const {updateEvents, updateState, updateSchedule, updateExclusion} = require('./state')
const {panelMessage$} = require('./panel')
const {broadcast, clientMessage$} = require('./client')
const {areaCommand, zoneCommand} = require('./command')
const {initScheduler} = require('./scheduler')

const getValue = value => {
    switch (value) {
    case 'True':
        return true
    case 'False':
        return false
    default:
        return value
    }
}

const handleEventUpdate = event => {
    if (event.property && ['zone', 'partition'].includes(event.type)) {
        const {timestamp, type, label, property, value} = event
        const isoTimestamp = new Date(timestamp * 1000)
        const key = `${type}/${label}`
        const eventInfo = {
            timestamp: Date.now(),
            date: isoTimestamp.toLocaleDateString(process.env.LOCALE),
            time: isoTimestamp.toLocaleTimeString(process.env.LOCALE),
            type,
            label,
            property,
            value
        }
        updateEvents(key, eventInfo)
        broadcast({event: {key, value: eventInfo}})
        log.debug(`Event: ${key} ${property} ${value}`)
    }
}

const handleStateUpdate = ({key, value}) => {
    const sanitizedValue = getValue(value)
    updateState(key, sanitizedValue)
    broadcast({state: _.set({}, key, sanitizedValue)})
}

const handleScheduleUpdate = scheduleUpdate => {
    updateSchedule(scheduleUpdate)
    broadcast({schedule: scheduleUpdate})
}

const handleExclusionUpdate = exclusionUpdate => {
    updateExclusion(exclusionUpdate)
    broadcast({exclusion: exclusionUpdate})
}

panelMessage$.subscribe({
    next: message => {
        if (message.event) {
            handleEventUpdate(message.event)
        } else if (message.state) {
            handleStateUpdate(message.state)
        } else {
            log.error('Unrecognized panel message:', message)
        }
    },
    error: error => log.error('Unexpected panelMessage$ error', error),
    complete: () => log.fatal('Unexpected panelMessage$ completion')
})

clientMessage$.subscribe({
    next: message => {
        if (message.areaCommand) {
            const {name, command, code} = message.areaCommand
            areaCommand(name, command, code)
        } else if (message.zoneCommand) {
            const {name, command, code} = message.zoneCommand
            zoneCommand(name, command, code)
        } else if (message.updateSchedule) {
            handleScheduleUpdate(message.updateSchedule)
        } else if (message.updateExclusion) {
            handleExclusionUpdate(message.updateExclusion)
        } else {
            log.error('Unrecognized client message:', message)
        }
    },
    error: error => log.error('Unexpected clientMessage$ error', error),
    complete: () => log.fatal('Unexpected clientMessage$ completion')
})

initScheduler()

log.info('Server ready')
