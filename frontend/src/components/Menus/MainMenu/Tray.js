import React, { useState } from 'react'
import classnames from 'classnames'
import { NavLink } from 'react-router-dom'
import { Paper, Tooltip, IconButton, ClickAwayListener } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { KeyboardArrowRight as ExpandIcon, Settings as SettingsIcon } from '@material-ui/icons'
import Menu from './Menu'
import Brand from '../../Brand/Brand'

const useStyles = makeStyles(theme => ({
    tray: {
        // ...theme.mixins.debug,
        borderRadius: 0,
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 99,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: '2rem',
        maxWidth: '4.5rem',
        transition: 'min-width 250ms',
        padding: 0,
    },
    open: {
        minWidth: '200px',
    },
    toggler: {
        margin: '0.5rem',
        transition: 'transform 500ms',
    },
    rotated: {
        transform: 'rotate(-180deg)',
    },
    flexer: { flex: 1, },
    settingsButton: {
        marginBottom: theme.spacing(4),
        '&:hover $settingsIcon': {
            transform: 'scale(1.1) rotate(120deg)',
            color: theme.palette.grey[800],
        },
    },
    activeSettingsButton: {
        color: theme.palette.secondary.main,
        '& $settingsIcon': {
            transform: 'scale(1.1) rotate(120deg)',
            color: theme.palette.secondary.main,
        },
        '&:hover $settingsIcon': {
            color: theme.palette.secondary.main,
        }
    },
    settingsIcon: {
        color: theme.palette.grey[300],
        transform: 'scale(1)',
        transition: 'color 250ms, transform 500ms ease-out',
    },
}))

const Tray = ({ children }) => {
    const [open, setOpen] = useState()
    const classes = useStyles()
    
    const handleToggleOpen = () => setOpen(!open)
    const handleClose = () => setOpen(false)

    return (
        <ClickAwayListener onClickAway={ open ? handleClose : () => {} }>
            <Paper className={ classnames(classes.tray, open ? classes.open : null) }>
                <IconButton className={ classnames(classes.toggler, open ? classes.rotated : null) } onClick={ handleToggleOpen }>
                    <ExpandIcon />
                </IconButton>

                <Menu expanded={ open } clickHandler={ handleClose } />

                <div className={ classes.flexer } style={{ pointerEvents: 'none', }}/>

                <Brand />
                
                <div className={ classes.flexer } style={{ pointerEvents: 'none', }}/>
                    
                <Tooltip title="Dashboard Settings" placement="top">
                    <IconButton component={ NavLink } to={ '/settings' } className={ classes.settingsButton } activeClassName={ classes.activeSettingsButton }>
                        <SettingsIcon className={ classes.settingsIcon } />
                    </IconButton>
                </Tooltip>
            </Paper>
        </ClickAwayListener>
    )
}

export default Tray