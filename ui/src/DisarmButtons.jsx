import {Box, Button, Grid} from '@mui/material'
import {useState} from 'react'
import {Auth} from './Auth'

const CODELESS_DISARM = true

export const DisarmButtons = ({area, areaCommand}) => {
    const [command, setCommand] = useState()

    const select = command => {
        if (CODELESS_DISARM) {
            execute(command)
        } else {
            setCommand(command)
        }
    }

    const execute = (command, code) =>
        areaCommand(area, command, code)

    const onDisarm = e => {
        e.stopPropagation()
        select('disarm')
    }

    const onClose = () =>
        setCommand()

    const onCode = code => {
        execute(command, code)
        setCommand()
    }

    return (
        <Box>
            <Grid container spacing={1} sx={{
                display: 'flex',
                justifyContent: 'center'
            }}>
                <Grid>
                    <Button
                        variant='contained'
                        color='success'
                        onClick={onDisarm}>
                        Disarm
                    </Button>
                </Grid>
            </Grid>
            <Auth
                open={!!command}
                onClose={onClose}
                onCode={onCode}
            />
        </Box>
    )
}
