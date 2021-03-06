import React, { Fragment, useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Card, CardHeader, CardActions, IconButton, CardContent, Dialog, DialogTitle, DialogContent } from '@material-ui/core'
import { Info as InfoIcon } from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
    cardActions: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    infoButton: {
        color: theme.palette.grey[300],
        transition: 'color 250ms',
        '&:hover': {
            color: theme.palette.grey[700],
        }
    }
}))

const Widget = props => {
    const { title, subtitle, action, info, footer, children } = props
    const [infoOpen, setInfoOpen] = useState(false)
    const classes = useStyles()

    const handleClickOpen = () => setInfoOpen(true)
    const handleClose = () => setInfoOpen(false)

    return (
        <Fragment>
            <Card>
                <CardHeader
                    title={ title }
                    subheader={ subtitle }
                    action={ action }
                    footer={ footer }
                />
                <CardContent>
                    { children }
                </CardContent>
                {
                    info || footer
                    ? (
                        <CardActions className={ classes.cardActions }>
                            <div>{ footer }</div>
                            {
                                info ? (
                                    <IconButton
                                        aria-label="Information"
                                        className={ classes.infoButton }
                                        onClick={ handleClickOpen }
                                    >
                                        <InfoIcon />
                                    </IconButton>
                                ) : null
                            }
                        </CardActions>
                    ) : null
                }
            </Card>
            {
                info
                ? (
                    <Dialog open={ infoOpen } onClose={ handleClose } aria-labelledby="information-dialog">
                        <DialogTitle id="information-dialog">Information</DialogTitle>
                        <DialogContent>
                            { info }
                        </DialogContent>
                    </Dialog>
                ) : null
            }
        </Fragment>
    )
}

export default Widget