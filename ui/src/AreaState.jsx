import {Chip, CircularProgress, Typography} from '@mui/material'

const getLabel = currentState =>
    <Typography variant='overline' fontWeight='bold'>
        {currentState}
    </Typography>

const getColor = (currentState = '') => {
    if (currentState === 'triggered') {
        return 'error'
    }
    if (currentState.startsWith('armed')) {
        return 'info'
    }
    return 'success'
}

const renderIcon = ({current_state, target_state}) =>
    current_state !== target_state
        ? <CircularProgress size='1rem'/>
        : null

export const AreaState = ({area}) => (
    <Chip
        label={getLabel(area.current_state)}
        color={getColor(area.current_state)}
        icon={renderIcon(area)}
    />
)
