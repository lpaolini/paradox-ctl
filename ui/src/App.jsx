// import {AllAreas} from './AllAreas.jsx'
import {Areas} from './Areas.jsx'
import {SystemInfo} from './SystemInfo.jsx'
import {Zones} from './Zones.jsx'
import {retry} from 'rxjs'
import {useCallback, useEffect, useState} from 'react'
import {webSocket} from 'rxjs/webSocket'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import _ from 'lodash'
// import {createHash} from 'crypto'

export const App = () => {
    const [state, setState] = useState({})
    const [events, setEvents] = useState({})
    const [schedules, setSchedules] = useState({})
    const [exclusions, setExclusions] = useState([])
    const [online, setOnline] = useState(false)

    const url = location.protocol === 'https:'
        ? `wss://${location.hostname}:${location.port}/api/ws`
        : `ws://${location.hostname}:${location.port}/api/ws`

    const [panel$] = useState(
        webSocket({
            url,
            openObserver: {
                next: () => setOnline(true)
            },
            closeObserver: {
                next: () => setOnline(false)
            }
        })
    )

    const send = useCallback(command => {
        panel$.next(command)
    }, [panel$])

    const areaCommand = (name, command, code) =>
        send({areaCommand: {name, command, code}})

    const onData = ({states, state, events, event, schedules, schedule, exclusions, exclusion}) => {
        if (states) {
            setState(states)
        }
        if (state) {
            setState(
                prevState => _.merge({}, prevState, state)
            )
        }
        if (events) {
            setEvents(events)
        }
        if (event) {
            setEvents(
                prevEvents => ({
                    ...prevEvents,
                    [event.key]: [...(prevEvents[event.key] || []), event.value]
                })
            )
        }
        if (schedules) {
            setSchedules(schedules)
        }
        if (schedule) {
            const {path, value} = schedule
            setSchedules(prevSchedules =>
                _.merge({}, prevSchedules, _.set({}, path, value))
            )
        }
        if (exclusions) {
            setExclusions(exclusions)
        }
        if (exclusion) {
            setExclusions(prevExclusions => {
                const {zone, bypass} = exclusion
                const index = prevExclusions.indexOf(zone)
                if (bypass) {
                    if (index === -1) {
                        return [...prevExclusions, zone]
                    }
                } else {
                    if (index !== -1) {
                        return prevExclusions.toSpliced(index, 1)
                    }
                }
            })
        }
    }

    const updateSchedule = (scheduleUpdate) => {
        send({updateSchedule: scheduleUpdate})
    }

    const updateExclusion = exclusionUpdate => {
        send({updateExclusion: exclusionUpdate})
    }

    useEffect(() => {
        const subscription = panel$.pipe(
            retry({delay: 1000})
        ).subscribe({
            next: data => onData(data),
            error: error => console.error(error)
        })
        return () => subscription.unsubscribe()
    }, [panel$])
    
    return (
        <Container maxWidth='sm' sx={{
            padding: '0'
        }}>
            <Box>
                <SystemInfo system={state?.states?.system} online={online}/>
                {/* <AllAreas sendCommand={sendCommand}/> */}
                <Areas state={state} events={events} exclusions={exclusions} schedules={schedules} updateSchedule={updateSchedule} areaCommand={areaCommand}/>
                <Zones state={state} events={events} exclusions={exclusions} updateExclusion={updateExclusion}/>
            </Box>
        </Container>
    )
}
