const {panelCommand} = require('./panel')
const {config: {exclusions}} = require('./state')
const log = require('./log')

const ARM_COMMANDS = ['arm', 'arm_instant', 'arm_stay', 'arm_force']

const isArmCommand = value =>
    ARM_COMMANDS.includes(value)

const areaCommand = (name, command, code) => {
    log.debug('Area command:', {name, command, code})
    if (isArmCommand(command)) {
        exclusions.forEach(zone => zoneBypass(zone, true, code))
    }
    panelCommand({key: `paradox/control/partitions/${name}`, command, code})
}

const zoneCommand = (name, command, code) => {
    log.debug('Zone command:', {name, command, code})
    panelCommand({key: `paradox/control/zones/${name}`, command, code})
}

const zoneBypass = (name, bypass, code) =>
    zoneCommand(name, bypass ? 'bypass' : 'clear_bypass', code)

module.exports = {
    areaCommand
}
