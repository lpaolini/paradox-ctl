import {Box, Divider, Slider, Switch, Typography} from '@mui/material'
import _ from 'lodash'

export const AreaSchedule = ({areaName, schedules = {}, updateSchedule}) => {
    const marks = [...Array(25).keys()].map(value => ({value, label: value % 2 == 0 ? value : null}))

    const DAYS = {
        '*': 'any day',
        mon: 'monday', 
        tue: 'tuesday', 
        wed: 'wednesday', 
        thu: 'thursday', 
        fri: 'friday', 
        sat: 'saturday', 
        sun: 'sunday'
    }

    const renderDaySchedule = (day, action) => {

        const handleTimeChange = (e, hour) => {
            updateSchedule({path: [areaName, day, action], value: {hour}})
        }

        const handleEnabledChange = (e, enabled) => {
            updateSchedule({path: [areaName, day, action], value: {enabled}})
        }

        const {enabled = false, hour = 0} = _.get(schedules, [areaName, day, action]) || {}

        const renderSlider = () =>
            enabled ? (
                <Slider
                    marks={marks}
                    min={0}
                    max={24}
                    value={hour}
                    valueLabelDisplay='auto'
                    onChange={handleTimeChange}
                />    
            ) : null
 
        return (
            <Box key={`${day}=${action}`}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Typography variant='overline' color='primary'>
                        {DAYS[day]}
                    </Typography>
                    <Switch
                        label='bypass'
                        size='small'
                        checked={enabled}
                        onChange={handleEnabledChange}
                        inputProps={{
                            onClick: e => e.stopPropagation(),
                            onFocus: e => e.stopPropagation()
                        }}
                    />
                </Box>
                {renderSlider()}
            </Box>
        )
    }
    
    const renderWeekSchedule = action =>
        ['*', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(
            day => renderDaySchedule(day, action)
        )

    return (
        <Box>
            <Divider>
                <Typography variant='overline' color='primary'>
                    Arm
                </Typography>
            </Divider>
            {renderWeekSchedule('arm')}
            <Divider>
                <Typography variant='overline' color='primary'>
                    Disarm
                </Typography>
            </Divider>
            {renderWeekSchedule('disarm')}
        </Box>
    )
}
