const {createServer} = require('http')
const {WebSocket, WebSocketServer} = require('ws')
const {Subject} = require('rxjs')
const _ = require('lodash')
const log = require('./log').getLogger('client')
const {states, events, config: {schedules, exclusions}} = require('./state')

const clientMessage$ = new Subject()

const server = createServer()
const wss = new WebSocketServer({server})

server.listen(process.env.HTTP_PORT || 80)

wss.on('connection', ws => {
    ws.on('error', error => {
        log.error('Client error', error)
    })
  
    ws.on('message', message => {
        const json = JSON.parse(message.toString('utf-8'))
        log.debug('Client message:', json)
        clientMessage$.next(json)
    })
    
    ws.on('close', () => {
        log.info(`Client disconnected, now ${wss.clients.size}`)
    })
    
    log.info(`Client connected, now ${wss.clients.size}`)

    // send full state on connect
    ws.send(JSON.stringify({states, events, schedules, exclusions}))
})

const broadcast = message =>
    wss.clients.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message))
        }
    })

module.exports = {
    broadcast, clientMessage$
}
