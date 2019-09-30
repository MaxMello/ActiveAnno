import {makeStyles} from "@material-ui/core";
import React from "react";
import PopupState, {bindMenu, bindPopover, bindTrigger} from "material-ui-popup-state";
import Box from "@material-ui/core/Box";
import Popover from "@material-ui/core/Popover";
import {Link} from "react-router-dom";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVert from "@material-ui/icons/MoreVert";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import {Pages} from "../../redux/pageSetup";


type NavMenuPopoverProps = {
    localize: Function,
    pages: Object
}

const useStyles = makeStyles(theme => ({
    popoverContent: {
        maxWidth: '50vw',
        ...theme.typography.body2
    },
    ellipsisButton: {
        margin: theme.spacing(1),
        color: 'white'
    },
    link: theme.link
}));

export default function NavMenuPopover(props: NavMenuPopoverProps) {
    const classes = useStyles();
    return <PopupState variant="popover" popupId={`NavMenuPopover`}>
        {popupState => (
            [<Box display={'inline'} {...bindTrigger(popupState)} key={"navMenuPopoverTarget"}>
                <IconButton
                    className={classes.ellipsisButton}>
                    <MoreVert/>
                </IconButton>
            </Box>,
                <Popover
                    key={"navMenuPopoverPopover"}
                    {...bindPopover(popupState)}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}>
                    <Box className={classes.popoverContent}>
                        <Menu {...bindMenu(popupState)}>
                            {Pages.ANNOTATE in props.pages ? <Link to={"/annotate"} className={classes.link}>
                                <MenuItem onClick={popupState.close}>{props.localize('annotate.name')}</MenuItem>
                            </Link> : null},
                            {Pages.CURATE in props.pages ? <Link to={"/curate"} className={classes.link}>
                                <MenuItem onClick={popupState.close}>{props.localize('curate.name')}</MenuItem>
                            </Link> : null},
                            {Pages.MANAGE in props.pages ? <Link to={"/manage"} className={classes.link}>
                                <MenuItem onClick={popupState.close}>{props.localize('manage.name')}</MenuItem>
                            </Link> : null},
                            {Pages.ADMIN in props.pages ? <Link to={"/admin"} className={classes.link}>
                                <MenuItem onClick={popupState.close}>{props.localize('admin.name')}</MenuItem>
                            </Link> : null},
                            {Pages.SEARCH in props.pages ? <Link to={"/search"} className={classes.link}>
                                <MenuItem onClick={popupState.close}>{props.localize('search.name')}</MenuItem>
                            </Link> : null},
                            <Link to={"/login"} className={classes.link}>
                                <MenuItem onClick={popupState.close}>{props.localize('login.name')}</MenuItem>
                            </Link>
                        </Menu>
                    </Box>
                </Popover>
            ]
        )}
    </PopupState>
}