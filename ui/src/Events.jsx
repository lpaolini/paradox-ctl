import {ArrowForward, Circle, RadioButtonChecked, RadioButtonUnchecked} from '@mui/icons-material'
import {Box, List, ListItem, ListItemText, Typography} from '@mui/material'
import {DateTime} from 'luxon'

const renderLabel = label =>
    <Typography
        variant='overline'
        color='primary'
        sx={{
            marginRight: '.5rem',
            lineHeight: 1.5
        }}>
        {label}
    </Typography>

const renderProperty = property =>
    <Typography
        variant='overline'
        sx={{
            marginRight: '.5rem',
            lineHeight: 1.5
        }}>
        {property}
    </Typography>

const renderValue = value =>
    <Typography
        variant='overline'
        color='secondary'
        sx={{
            marginRight: '.5rem',
            lineHeight: 1.5
        }}>
        {value}
    </Typography>

const renderIcon = value =>
    value
        ? <RadioButtonChecked fontSize='small'/>
        : <RadioButtonUnchecked color='disabled' fontSize='small'/>
        // ? <Checkbox checked fontSize='small'/>
        // : <Checkbox color='disabled' fontSize='small'/>

const renderOpenIcon = value =>
    value
        ? <Circle color='error' fontSize='small'/>
        : <Circle color='success' fontSize='small'/>

const renderEventDescription = ({type, property, value, label}, mode) =>
    <Box sx={{
        display: 'flex',
        alignItems: 'center',
    }}>
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
        }}>
            {type === mode ? null : renderLabel(label)}
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end'
            }}>
                {property == 'open' ? null : renderProperty(property)}
                {typeof value === 'string' ? renderValue(value) : null}
            </Box>
        </Box>
        {typeof value === 'string' ? <ArrowForward/> : property == 'open' ? renderOpenIcon(value) : renderIcon(value)}
    </Box>

const renderDate = event =>
    <span>{event.date} / {event.time}</span>
    
const renderEvent = (event, index, mode) =>
    <ListItem
        key={event.timestamp + '-' + index}
        disableGutters
        disablePadding>
        <ListItemText
            primary={DateTime.fromMillis(event.timestamp).toRelative()}
            secondary={renderDate(event)}/>
        {renderEventDescription(event, mode)}
    </ListItem>

export const Events = ({events, mode}) =>
    <List dense>
        {events?.map((event, index) => renderEvent(event, index, mode))}
    </List>
