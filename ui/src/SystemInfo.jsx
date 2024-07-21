import {Accordion, AccordionDetails, AccordionSummary, Chip, Typography} from '@mui/material'
import {Battery5Bar, BatteryFull, Bolt, Check, Power, Warning} from '@mui/icons-material'
import {DateTime} from 'luxon'
import {Options} from './Options.jsx'
import {useEffect, useState} from 'react'
import Box from '@mui/material/Box'

const renderConnectionStatus = online =>
    <Typography fontWeight='bold' color={online ? 'success' : 'error'}>
        {online ? 'ONLINE' : 'OFFLINE'}
    </Typography>

const renderPanelStatus = (date, time, now) => {
    const delta = DateTime.fromISO([date, time].join('T')).diff(DateTime.fromMillis(now)).toMillis()
    return (
        <Typography fontWeight='bold' color={delta < 15000 ? 'success' : 'error'}>
            {time}
        </Typography>
    )
}

const renderTimestamp = ({time: timestamp = ''} = {}, now) => {
    const [date, time] = timestamp.split(' ')
    return (
        <Box sx={{display: 'flex'}}>
            {renderPanelStatus(date, time, now)}
        </Box>
    )
}

const renderTrouble = trouble =>
    trouble
        ? <Warning color='error'/>
        : <Check color='success'/>

const renderStatus = (online, power, date, trouble, now) => (
    <Box sx={{
        display: 'flex',
        flexGrow: '1',
        justifyContent: 'space-between'
    }}>
        {renderConnectionStatus(online)}
        {renderPowerStatus(power)}
        {renderTrouble(trouble)}
        {renderTimestamp(date, now)}
    </Box>
)

const renderVoltage = (voltage, icon) =>
    voltage ? (
        <Box sx={{display: 'flex'}}>
            {icon}
            <Typography>{voltage}</Typography>
        </Box>
    ) : null

const getVoltageColor = voltage =>
    voltage >= 12 ? 'success' : 'error'
        
const renderPowerStatus = ({vdc, battery, dc} = {}) => (
    <Box sx={{display: 'flex'}}>
        {renderVoltage(vdc, <Power color={getVoltageColor(vdc)}/>)}
        {renderVoltage(dc, <Bolt color={getVoltageColor(vdc)}/>)}
        {renderVoltage(battery, <Battery5Bar color={getVoltageColor(vdc)}/>)}
    </Box>
)

export const SystemInfo = ({system, online}) => {
    const [now, setNow] = useState(Date.now())

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000)
        return () => clearInterval(interval)
    }, [])

    const trouble = system?.troubles && Object.values(system.troubles).some(value => value)
    return (
        <Accordion>
            <AccordionSummary sx={{
                '&:focus': {
                    outline: 'none',
                }
            }}>
                {renderStatus(online, system?.power, system?.date, trouble, now)}
            </AccordionSummary>
            <AccordionDetails>
                <Options options={system?.troubles}/>
            </AccordionDetails>
        </Accordion>
    )
}
