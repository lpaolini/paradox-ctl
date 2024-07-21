import {Accordion, AccordionDetails, AccordionSummary, Box, Typography} from '@mui/material'
import {Notifications, NotificationsActive, NotificationsOutlined, Schedule, TimerOutlined, Warning} from '@mui/icons-material'
import {AreaDetails} from './AreaDetails'
import {AreaState} from './AreaState'
import { DateTime } from 'luxon'

const renderAlarm = ({audible_alarm, silent_alarm, was_in_alarm, alarm_in_memory, arm, ready, exit_delay, entry_delay}) => {
    if (audible_alarm || silent_alarm) {
        return <NotificationsActive color='error'/>
    }
    if (was_in_alarm) {
        return <NotificationsOutlined color='error'/>
    }
    if (exit_delay || entry_delay) {
        return <TimerOutlined color='warning'/>
    }
    if (arm) {
        return <Notifications color='info'/>
    }
    if (ready) {
        return <NotificationsOutlined color='success'/>
    }
    return <NotificationsOutlined color='warning'/>
}

const renderTrouble = ({trouble}) => {
    if (trouble) {
        return <Warning color='warning'/>
    }
    return null
}

const renderSchedule = (schedules) =>
    // Object.entries(schedules).some( ([, {arm: {enabled: armEnabled}, disarm: {enabled: disarmEnabled}}]) => armEnabled || disarmEnabled)
    Object.keys(schedules).length
        ? <Schedule color='info'/>
        : null

const renderAreaName = name =>
    <Typography variant='overline' sx={{
        display: 'flex',
        marginLeft: '.5rem',
        lineHeight: 1,
        fontWeight: 'bold'
    }}>
        {name}
    </Typography>

export const Area = ({state = {}, definition = {}, events, exclusions, schedules, updateSchedule, areaCommand}) => {
    const {
        name,
        area
        // area: {
        //     alarm_duration_finished,
        //     alarm_in_memory,
        //     all_zone_closed,
        //     arm,
        //     arm_away,
        //     arm_no_entry,
        //     arm_stay,
        //     audible_alarm,
        //     auto_arm_reach,
        //     auto_arming_engaged,
        //     bell,
        //     bypass_ready,
        //     cancel_alarm_reporting_on_disarming,
        //     current_state,
        //     entry_delay,
        //     entry_delay_finished,
        //     exit_delay,
        //     exit_delay_finished,
        //     fire_alarm,
        //     fire_delay_end,
        //     fire_delay_in_progress,
        //     follow_become_delay,
        //     force_ready,
        //     inhibit_ready,
        //     intellizone_delay_finished,
        //     intellizone_engage,
        //     lockout,
        //     no_movement_delay_end,
        //     open_close_kiss_off,
        //     panic_alarm,
        //     partition_recently_close,
        //     police_code_delay,
        //     programming,
        //     ready,
        //     remote_arming,
        //     silent_alarm,
        //     stay_arming_auto,
        //     stay_instant_ready,
        //     target_state,
        //     time_to_refresh_zone_status,
        //     trouble,
        //     tx_delay_finished,
        //     voice_arming,
        //     was_in_alarm,
        //     zone_bypassed,
        //     zone_fire_loop_trouble,
        //     zone_low_battery_trouble,
        //     zone_supervision_trouble,
        //     zone_tamper_trouble
        // }
    } = state

    const renderAreaSummary = () =>
        <Box sx={{
            display: 'flex',
            flexGrow: '1',
            alignItems: 'center',
            justifyContent: 'space-between'
        }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center'
            }}>
                {renderAlarm(area)}
                {renderTrouble(area)}
                {renderSchedule(schedules)}
                {renderAreaName(name)}
            </Box>
            <AreaState area={area}/>
        </Box>

    const renderAreaDetails = () =>
        <AreaDetails 
            state={state}
            events={events}
            exclusions={exclusions}
            schedules={schedules}
            updateSchedule={updateSchedule}
            areaCommand={areaCommand}
        />

    return (
        <Accordion>
            <AccordionSummary sx={{
                bgcolor: '#303030',
                '&:focus': {
                    outline: 'none',
                }
            }}>
                {renderAreaSummary()}
            </AccordionSummary>
            <AccordionDetails>
                {renderAreaDetails()}
            </AccordionDetails>
        </Accordion>
    )
}
