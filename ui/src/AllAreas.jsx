import {Button, Grid} from '@mui/material'

export const AllAreas = areaCommand => {
    const onAway = e => {
        e.stopPropagation()
        areaCommand('arm') // ARMED_AWAY (ARM)
    }
    
    const onInstant = e => {
        e.stopPropagation()
        areaCommand('arm_instant') // ARMED_NIGHT (ARM, ARM_NO_ENTRY)
    }
    
    const onStay = e => {
        e.stopPropagation()
        areaCommand('arm_stay') // ARMED_HOME (ARM, ARM_STAY)
    }
    
    const onForce = e => {
        e.stopPropagation()
        areaCommand('arm_force') // ARMED_AWAY (ARM, ARM_AWAY)
    }
    
    const onDisarm = e => {
        e.stopPropagation()
        return areaCommand('disarm')
    }

    return (
        <Grid container spacing={1} sx={{
            display: 'flex',
            justifyContent: 'center'
        }}>
            <Grid>
                <Button
                    variant='contained'
                    color='error'
                    // disabled={!isDisarmed()}
                    onClick={onInstant}>
                    Instant
                </Button>
            </Grid>
            <Grid>
                <Button
                    variant='contained'
                    color='error'
                    // disabled={!isDisarmed()}
                    onClick={onAway}>
                    Away
                </Button>
            </Grid>
            <Grid>
                <Button
                    variant='contained'
                    color='error'
                    // disabled={!isDisarmed()}
                    onClick={onStay}>
                    Stay
                </Button>
            </Grid>
            <Grid>
                <Button
                    variant='contained'
                    color='error'
                    // disabled={isArmed()}
                    onClick={onForce}>
                    Force
                </Button>
            </Grid>
            <Grid>
                <Button
                    variant='contained'
                    color='success'
                    onClick={onDisarm}>
                Disarm
                </Button>
            </Grid>
        </Grid>
    )
}
