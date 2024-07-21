import {Box, Tab} from '@mui/material'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import {Events} from './Events'
import {Options} from './Options'
import {useState} from 'react'

export const ZoneDetails = ({state = {}, definition = {}, events}) => {
    const [tab, setTab] = useState('events')

    const onTabChange = (event, tab) =>
        setTab(tab)
    
    const {
        zone = {}
    } = state

    const {
        definition: type,
        options,
        partition
    } = definition

    return (
        <TabContext value={tab}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={onTabChange} centered>
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
                    <Tab label='Configuration' value='configuration' sx={{
                        '&:focus': {
                            outline: 'none'
                        }
                    }}/>
                </TabList>
            </Box>
            <TabPanel value='events'>
                <Events events={events} mode='zone'/>
            </TabPanel>
            <TabPanel value='status'>
                <Options options={zone}/>
            </TabPanel>
            <TabPanel value='configuration'>
                <Box>
                    <Options options={{type}}/>
                    <Options options={options}/>
                </Box>
            </TabPanel>
        </TabContext>
    )
}
