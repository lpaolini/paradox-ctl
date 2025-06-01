import {Box, Button} from '@mui/material'
import {useState} from 'react'
import {Auth} from './Auth'

const CODELESS_ARM = true

export const ArmButtons = ({area, areaCommand}) => {
    const [command, setCommand] = useState()

    const select = command => {
        if (CODELESS_ARM) {
            execute(command)
        } else {
            setCommand(command)
        }
    }

    const execute = (command, code) =>
        areaCommand(area, command, code)

    const onArmInstant = e => {
        e.stopPropagation()
        select('arm_instant')
    }
    
    const onArmAway = e => {
        e.stopPropagation()
        select('arm')
    }
    
    const onArmStay = e => {
        e.stopPropagation()
        select('arm_stay')
    }
    
    const onArmForce = e => {
        e.stopPropagation()
        select('arm_force')
    }
    
    const isArmed = () =>
        area.arm

    const isDisarmed = () =>
        !area.arm

    const onClose = () =>
        setCommand()

    const onCode = code => {
        execute(command, code)
        setCommand()
    }

    return (
        <Box display='flex' flexDirection='row' alignItems='center' justifySelf='center' gap={1}>
            <Button
                variant='contained'
                color='error'
                disabled={!isDisarmed()}
                onClick={onArmInstant}>
                Instant
            </Button>
            <Button
                variant='contained'
                color='error'
                disabled={!isDisarmed()}
                onClick={onArmAway}>
                Away
            </Button>
            <Button
                variant='contained'
                color='error'
                disabled={!isDisarmed()}
                onClick={onArmStay}>
                Stay
            </Button>
            <Button
                variant='contained'
                color='error'
                disabled={isArmed()}
                onClick={onArmForce}>
                Force
            </Button>
        </Box>
    )
}
