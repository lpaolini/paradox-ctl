import {Circle} from '@mui/icons-material';
import {Box, Button, Dialog, DialogContent, DialogTitle, Grid, TextField} from '@mui/material'
import {useEffect, useState} from 'react'

const Keyboard = ({onCode}) => {
    const [code, setCode] = useState('')

    const KEYS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'clr', 0, 'ent']
    const MAX_LENGTH = 6

    useEffect(() => {
        if (code.length === MAX_LENGTH) {
            onCode(code)
        }
    }, [code])

    const handleKey = (e, key) => {
        switch (key) {
        case 'clr':
            setCode(code => '')
            break
        case 'ent':
            onCode(code)
            break
        default:
            setCode(code => [code, key].join(''))
        }
        e.target.blur()
    }

    const renderDot = filled =>
        filled
            ? <Circle color='error' sx={{ padding: '0rem' }}/>
            : <Circle color='disabled' sx={{ padding: '0rem' }}/>

    const renderDots = () =>
        [...Array(MAX_LENGTH).keys()].map(dot => (
            <Grid
                key={dot}
                size={2}
                display='flex'
                justifyContent='center'
                alignItems='center'
                sx={{marginBottom: '1rem'}} > 
                {renderDot(dot < code.length)}
            </Grid>
        ))

    const renderKeyboard = () =>
        KEYS.map(key => (
            <Grid
                key={key}
                size={4}
                display='flex'
                justifyContent='center'
                alignItems='center'>
                <Button 
                    variant='outlined'
                    sx={{padding: '1rem'}}
                    onClick={e => handleKey(e, key)}>
                    {key}
                </Button>
            </Grid>
        ))

    return (
        <Grid container spacing={1} width={'16rem'}>
            {renderDots()}
            {renderKeyboard()}
        </Grid>
    )
}

export const Auth = ({open, onClose, onCode}) => {
    const renderUserInput = () =>
        <TextField
            required
            id='outlined-required'
            label='User code'
            defaultValue='luca'
            fullWidth
        />

    return (
        <Dialog onClose={onClose} open={open}>
            <DialogContent>
                <Keyboard onCode={onCode}/>
            </DialogContent>
        </Dialog>
    )
}
