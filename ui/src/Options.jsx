import {Box, Typography} from '@mui/material'
import {RadioButtonChecked, RadioButtonUnchecked} from '@mui/icons-material'

const renderOptionValue = value =>
    typeof value == 'string'
        ? <Typography variant='overline'>{value}</Typography>
        : value
            ? <RadioButtonChecked fontSize='small'/>
            : <RadioButtonUnchecked color='disabled' fontSize='small'/>

const renderOptionName = name =>
    <Typography variant='overline' sx={{
        display: 'flex',
        flexGrow: 1
    }}>
        {name}
    </Typography>

const renderOption = (key, value) =>
    <Box key={key} sx={{
        display: 'flex',
        alignItems: 'center'
    }}>
        {renderOptionName(key)}
        {renderOptionValue(value)}
    </Box>

export const Options = ({options = {}}) =>
    <Box>
        {Object.entries(options).map(([key, value]) => renderOption(key, value))}
    </Box>
