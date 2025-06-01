const mqtt = require('mqtt')
const _ = require('lodash')
const {Subject, map, ReplaySubject} = require('rxjs')
// const {createHash, randomBytes} = require('crypto')
const log = require('./log').getLogger('panel')

const TOPIC_PREFIX = process.env.MQTT_TOPIC_PREFIX || 'paradox-pai'

const TOPICS = [
    `${TOPIC_PREFIX}/states/#`,
    `${TOPIC_PREFIX}/definitions/#`,
    `${TOPIC_PREFIX}/events/#`
]

const panel = mqtt.connect(process.env.MQTT_URL, {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD
})

const panelMessage$ = new Subject()
const panelCommand$ = new Subject()
const panelChallenge$ = new ReplaySubject(1)

// const getChallenge = () =>
//     randomBytes(20).toString('hex')

// const getCommandPayload = ({command, user, code, challenge}) =>
//     challenge && code
//         ? user
//             ? `${command} ${user} ${getSecret(challenge, code)}`
//             : `${command} ${getSecret(challenge, code)}`
//         : command

// const getSecret = (challenge, code) => {
//     const shasum = createHash('sha1')
//     const rounds = 10000
//     // const text = `b'${challenge}'${code}`
//     const text = `b'${challenge}'${code}` // HACK for overcoming PAI bug
//     for (let i = rounds; i > 0; i--) {
//         shasum.update(text)
//     }
//     return shasum.digest('hex')
// }

// const panelCommandQueue$ = panelCommand$.pipe(
//     zipWith(panelChallenge$),
//     map(([{key, command, code}, challenge]) =>
//         ({key, value: getCommandPayload({command, code, challenge})})
//     )
// )

const panelCommandQueue$ = panelCommand$.pipe(
    map(({key, command}) =>
        ({key, value: command})
    )
)

panelCommandQueue$.subscribe({
    next: ({key, value}) => {
        log.debug('Command', {key, value})
        panel.publish(key, Buffer.from(value, 'utf-8'))
    },
    error: error => log.error('Unexpected panelCommandQueue$ error', error),
    complete: () => log.fatal('Unexpected panelCommandQueue$ completion')
})

const handleEvent = value =>
    panelMessage$.next({event: JSON.parse(value)})

const handleState = (key, value) =>
    panelMessage$.next({state: {key, value}})

const handleChallenge = value =>
    panelChallenge$.next(value)

panel.on('connect', () => {
    log.info('Connected to MQTT')
    panel.subscribe(TOPICS, err => {
        if (err) {
            log.error('error', err)
            process.exit(1)
        }
    })
})

panel.on('message', (topic, message) => {
    const key = topic.replace(`${TOPIC_PREFIX}/`, '').replaceAll('/', '.')
    const value = message.toString()
    try {
        switch (key) {
            case 'events.raw':
                handleEvent(value)
                break
            case 'states.challenge':
                handleChallenge(value)
                break
            default:
                if (key.startsWith('states.') || key.startsWith('definitions.')) {
                    handleState(key, value)
                }
        }
    } catch (error) {
        log.error('Error parsing MQTT message', error)
    }
})

const panelCommand = ({key, command, code}) =>
    panelCommand$.next({key, command, code})

module.exports = {
    panelMessage$, panelCommand
}
