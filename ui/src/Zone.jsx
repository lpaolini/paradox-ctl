import {Accordion, AccordionDetails, AccordionSummary, Box, Switch, Typography} from '@mui/material'
import {Battery1Bar, Circle, NotificationsActive, NotificationsOffOutlined, NotificationsOutlined, TimerOutlined, Warning} from '@mui/icons-material'
import {ZoneDetails} from './ZoneDetails'
import {useEffect, useState} from 'react'

const renderZoneStatus = (open, events) =>
    <Circle color={open ? 'error' : 'success'} fontSize='small'/>
      
const renderZoneName = (name, id) =>
    <Box sx={{
        display: 'flex',
        alignItems: 'center',
    }}>

    <Typography variant='overline' sx={{
        display: 'flex',
        marginLeft: '.5rem',
        lineHeight: 1
    }}>
        {name}
    </Typography>
    <Typography variant='overline' color='primary' sx={{
        display: 'flex',
        marginLeft: '.5rem',
        lineHeight: 1
    }}>
        {id}
    </Typography>
    </Box>

const renderAlarmStatus = ({shutted_down, bypassed, presently_in_alarm, generated_alarm, activated_entry_delay, activated_intellizone_delay}) => {
    if (presently_in_alarm) {
        return <NotificationsActive color='error'/>
    }
    if (bypassed) {
        return <NotificationsOffOutlined color='primary'/>
    }
    if (shutted_down) {
        return <NotificationsOffOutlined color='warning'/>
    }
    if (activated_entry_delay || activated_intellizone_delay) {
        return <TimerOutlined color='error'/>
    }
    if (generated_alarm) {
        return <NotificationsOutlined color='error'/>
    }
    return <NotificationsOutlined color='disabled'/>
}

const renderTrouble = ({supervision_trouble, tamper, zone_tamper_trouble, low_battery}) => {
    if (tamper || zone_tamper_trouble) {
        return <Warning color={tamper ? 'error' : 'warning'}/>
    }
    if (supervision_trouble) {
        return <Warning color='warning'/>
    }
    if (low_battery) {
        return <Battery1Bar color='error'/>
    }
    // return <Check color='disabled'/>
    return null
}

const getActivityLevel = timestamp => {
    const seconds = (Date.now() - timestamp) / 1000
    if (seconds < 10) return 5      // ***** < 10 sec
    if (seconds < 60) return 4      //  **** < 1 min
    if (seconds < 600) return 3     //   *** < 10 min
    if (seconds < 3600) return 2    //    ** < 1 hour
    if (seconds < 21600) return 1   //     * < 6 hours
    return 0
}

const renderActivity = events => {
    const lastZoneOpenEvent = events.find(({property}) => property === 'open')
    if (lastZoneOpenEvent?.timestamp) {
        // const minutes = Math.ceil((Date.now() - lastZoneOpenEvent?.timestamp) / 60000)
        // const activity = Math.max(0, 3 - Math.floor(Math.log10(minutes)))
        // return [0, 1, 2, 3].slice(0, activity).map(level => <Circle key={level} color='error' sx={{fontSize: '.75rem'}}/>)
        const activityLevel = getActivityLevel(lastZoneOpenEvent?.timestamp)
        return [0, 1, 2, 3, 4]
            .slice(0, activityLevel)
            .map(level =>
                <Circle key={level} color='error' sx={{fontSize: '.75rem'}}/>
            )
    } else {
        return null
    }
}

const renderSummary = ({name, zone: {
    activated_entry_delay,
    activated_intellizone_delay,
    bypassed,
    generated_alarm,
    low_battery,
    open,
    presently_in_alarm,
    shutted_down,
    supervision_trouble,
    tamper,
    zone_tamper_trouble
    // tx_delay
} = {}}, {id}, events) => (
    <Box sx={{
        display: 'flex',
        flexGrow: '1',
        alignItems: 'center',
        justifyContent: 'space-between'
    }}>
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
        }}>
            {renderZoneStatus(open, events)}
            {renderZoneName(name, id)}
        </Box>
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
        }}>
            {renderActivity(events)}
            {renderTrouble({supervision_trouble, tamper, zone_tamper_trouble, low_battery})}
            {renderAlarmStatus({shutted_down, bypassed, presently_in_alarm, generated_alarm, supervision_trouble, tamper, activated_entry_delay, activated_intellizone_delay})}
        </Box>
    </Box>
)

const renderBypass = (bypass, {bypass_enabled}, onBypass) =>
    <Box sx={{
        display: 'flex',
        alignItems: 'center'
    }}>
        <Switch
            label='bypass'
            size='small'
            checked={bypass}
            disabled={!bypass_enabled}
            onChange={onBypass}
            inputProps={{
                onClick: e => e.stopPropagation(),
                onFocus: e => e.stopPropagation()
            }}/>
    </Box>

export const Zone = ({state = {}, definition = {}, events, exclusions, updateExclusion}) => {
    const {name} = state
    const bypassed = exclusions.includes(name)
    const [bypass, setBypass] = useState(bypassed)

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (bypass !== bypassed) {
                setBypass(bypassed)
            }
        }, 3000)
        return () => clearTimeout(timeout)
    }, [bypass, bypassed])

    const onBypass = (e, bypass) => {
        setBypass(bypass)
        updateExclusion({zone: name, bypass})
    }

    return (
        <Accordion>
            <AccordionSummary sx={{
                '&:focus': {
                    outline: 'none',
                }
            }}>
                {renderSummary(state, definition, events)}
                {renderBypass(bypass, definition.options, onBypass)}
            </AccordionSummary>
            <AccordionDetails>
                <ZoneDetails
                    state={state}
                    definition={definition}
                    events={events}/>
            </AccordionDetails>
        </Accordion>
    )
}
