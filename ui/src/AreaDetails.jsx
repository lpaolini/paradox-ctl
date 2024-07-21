import {Box, Tab} from '@mui/material'
import {useState} from 'react'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import {AreaSchedule} from './AreaSchedule'
import {Events} from './Events'
import {Options} from './Options'
import {ArmButtons} from './ArmButtons'
import {DisarmButtons} from './DisarmButtons'

export const AreaDetails = ({state = {}, definition = {}, events, exclusions, schedules, updateSchedule, areaCommand}) => {
    const {
        name,
        area
    } = state

    const [tab, setTab] = useState('arm/disarm')

    const onTabChange = (event, tab) =>
        setTab(tab)
    
    const renderAreaButtons = () =>
        area.current_state === 'disarmed'
            ? <ArmButtons area={name} areaCommand={areaCommand}/>
            : <DisarmButtons area={name} areaCommand={areaCommand}/>

    return (
        <TabContext value={tab}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={onTabChange} centered>
                    <Tab label='Manual' value='arm/disarm' sx={{
                        '&:focus': {
                            outline: 'none'
                        }
                    }}/>
                    <Tab label='Auto' value='schedule' sx={{
                        '&:focus': {
                            outline: 'none'
                        }
                    }}/>
                    <Tab label='Events' value='events' sx={{
                        '&:focus': {
                            outline: 'none'
                        }
                    }}/>
                    <Tab label='Status' value='status' sx={{
                        '&:focus': {
                            outline: 'none'
                        }
                    }}/>
                </TabList>
            </Box>
            <TabPanel value='arm/disarm'>
                {renderAreaButtons()}
            </TabPanel>
            <TabPanel value='schedule'>
                <AreaSchedule
                    areaName={name}
                    schedules={schedules}
                    updateSchedule={updateSchedule}
                />
            </TabPanel>
            <TabPanel value='events'>
                <Events
                    events={events}
                    mode='partition'
                />
            </TabPanel>
            <TabPanel value='status'>
                <Options options={area}/>
            </TabPanel>
        </TabContext>
    )
}
