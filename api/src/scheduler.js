const _ = require('lodash')
const log = require('./log').getLogger('scheduler')
const {config: {schedules}, isArmed} = require('./state')
const {areaCommand} = require('./command')
const {DAYS} = require('./days')

const scheduled = {
    lastCheck: undefined
}

const checkArmed = (area, schedule, currentDate, lastCheck) => {
    if (currentDate.getHours() >= schedule.arm.hour && lastCheck.getHours() < schedule.arm.hour) {
        log.debug(`Ensure armed area: ${area}`)
        if (!isArmed(area)) {
            log.info(`Auto arming area: ${area}`)
            areaCommand(area, 'arm_instant')
        }
    }
}

const checkDisarmed = (area, schedule, currentDate, lastCheck) => {
    if (currentDate.getHours() >= schedule.disarm.hour && lastCheck.getHours() < schedule.disarm.hour) {
        log.debug(`Ensure disarmed area: ${area}`)
        if (isArmed(area)) {
            log.info(`Auto disarming area: ${area}`)
            areaCommand(area, 'disarm')
        }
    }
}

const scheduler = () => {
    const date = new Date()
    const day = DAYS[date.getDay()]

    if (scheduled.lastCheck) {
        Object.entries(schedules).forEach(([area, areaSchedules]) => {
            const anySchedule = areaSchedules['*']
            const daySchedule = areaSchedules[day]
            if (daySchedule?.arm?.enabled) {
                checkArmed(area, daySchedule, date, scheduled.lastCheck)
            } else if (anySchedule?.arm?.enabled) {
                checkArmed(area, anySchedule, date, scheduled.lastCheck)
            }
            if (daySchedule?.disarm?.enabled) {
                checkDisarmed(area, daySchedule, date, scheduled.lastCheck)
            } else if (anySchedule?.disarm?.enabled) {
                checkDisarmed(area, anySchedule, date, scheduled.lastCheck)
            }
        })
    }

    scheduled.lastCheck = date
}

const initScheduler = () => {
    setInterval(scheduler, 5000)
}

module.exports = {
    initScheduler
}
