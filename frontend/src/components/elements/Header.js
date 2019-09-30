import React, {Component} from 'react';
import {AppBar, Badge, Button, Toolbar, Typography, withStyles} from '@material-ui/core';
import classNames from 'classnames';
import withLocalization from 'react-localize/es/withLocalization';
import color from 'color';
import IconButton from '@material-ui/core/IconButton';
import CommentOutlined from "@material-ui/icons/CommentOutlined";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Search from "@material-ui/icons/Search";
import Avatar from "@material-ui/core/Avatar";
import {connect} from "react-redux";
import {Pages} from "../../redux/pageSetup";
import {Link} from "react-router-dom";
import LinearProgress from "@material-ui/core/LinearProgress";
import Hidden from "@material-ui/core/Hidden";
import {HideOnScroll} from "../helper/HideOnScroll";
import NavMenuPopover from "./NavMenuPopover";
import withWidth, {isWidthDown} from "@material-ui/core/withWidth";
import type {PageSetupState} from "../../types/PageSetupTypes";

type HeaderProps = {
    history: Array<string>,
    pageSetup: PageSetupState,
    loading: boolean
}

const styles: Function = (theme: Object): Object => ({
        hide: {
            display: 'none',
        },
        grow: {
            flexGrow: 1,
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        titleIcon: {
            transform: `scaleX(-1)`
        },
        sectionDesktop: {
            display: 'none',
            [theme.breakpoints.up('md')]: {
                display: 'flex',
            },
        },
        rightIcon: {
            marginLeft: 6
        },
        button: {
            marginLeft: 12,
            marinRight: 12,
            color: 'white',
            // backgroundColor: theme.palette.primary.dark,
            //color: theme.palette.primary.contrastText,
            '&:hover': {
                backgroundColor: color(theme.palette.primary.main).darken(0.1).hex(),
                color: theme.palette.primary.contrastText
            }
        },
        activeButton: {
            backgroundColor: theme.palette.primary.mediumDark
        },
        logo: {
            margin: theme.spacing(1),
            backgroundColor: theme.palette.secondary.main,
        },
        link: theme.link,
        flexLink: {
            ...theme.link,
            display: 'flex',
            alignItems: 'center'
        },
        progressBar: {
            backgroundColor: 'transparent'
        },
        progressBarColor: {
            backgroundColor: color(theme.palette.primary.main).darken(0.3).hex(),
        }
    }
);

class Header extends Component<HeaderProps> {

    getActiveClassForButton(path: string): string {
        if(this.props.history.location.pathname === path) {
            return classNames(this.props.classes.button, this.props.classes.activeButton);
        } else {
            return this.props.classes.button;
        }
    }

    getBadgeContent(path: string) {
        if(this.props.pageSetup.pageSetup && this.props.pageSetup.pageSetup.pages && this.props.pageSetup.pageSetup.pages[path]) {
            return this.props.pageSetup.pageSetup.pages[path].badgeCount;
        } else {
            return 0;
        }
    }

    getMobileTitle(): string {
        const locationPath = this.props.history.location.pathname;
        if (locationPath.startsWith("/annotate")) {
            return this.props.localize('annotate.name')
        } else if (locationPath.startsWith("/curate")) {
            return this.props.localize('curate.name')
        } else if (locationPath.startsWith("/manage")) {
            return this.props.localize('manage.name')
        } else if (locationPath.startsWith("/admin")) {
            return this.props.localize('admin.name')
        } else if (locationPath.startsWith("/login")) {
            return this.props.localize('login.name')
        } else if(locationPath.startsWith('/search')) {
            return this.props.localize('search.name')
        } else {
            return this.props.localize('title')
        }
    }

    wrapInHideOnScroll(component: Component) {
        if(isWidthDown("sm", this.props.width)) {
            return <HideOnScroll>
                {component}
            </HideOnScroll>;
        } else {
            return component;
        }
    }

    render() {
        const annotationButton = <Link to={'/annotate'} className={this.props.classes.link} key={'headerLinkAnnotate'}>
                    <Badge badgeContent={this.getBadgeContent("annotate")} color="secondary" showZero={false} max={99}>
                        <Button classes={{root: this.getActiveClassForButton('/annotate')}}
                                size="small">
                            {this.props.localize('annotate.name')}
                        </Button>
                    </Badge>
        </Link>;
        const curationButton = <Link to={'/curate'} className={this.props.classes.link} key={'headerLinkCurate'}>
                <Badge badgeContent={this.getBadgeContent("curate")} color="secondary" showZero={false} max={99}>
                    <Button classes={{root: this.getActiveClassForButton('/curate')}}
                            size="small">
                        {this.props.localize('curate.name')}
                    </Button>
                </Badge>
        </Link>;
        const manageButton = (
            <Link to={'/manage'} className={this.props.classes.link} key={'headerLinkManage'}>
                <Button classes={{root: this.getActiveClassForButton('/manage')}}
                    size="small">
                    {this.props.localize('manage.name')}
                </Button>
            </Link>
        );
        const adminButton = (
            <Link to={'/admin'} className={this.props.classes.link} key={'headerLinkAdmin'}>
                <Button classes={{root: this.getActiveClassForButton('/admin')}}
                        size="small">
                    {this.props.localize('admin.name')}
                </Button>
            </Link>
        );
        const navButtons = [];
        if(this.props.pageSetup.pageSetup && Pages.ANNOTATE in this.props.pageSetup.pageSetup.pages) {
            navButtons.push(annotationButton);
        }
        if(this.props.pageSetup.pageSetup && Pages.CURATE in this.props.pageSetup.pageSetup.pages) {
            navButtons.push(curationButton);
        }
        if(this.props.pageSetup.pageSetup && Pages.MANAGE in this.props.pageSetup.pageSetup.pages) {
            navButtons.push(manageButton);
        }
        if(this.props.pageSetup.pageSetup && Pages.ADMIN in this.props.pageSetup.pageSetup.pages) {
            navButtons.push(adminButton);
        }
        if(this.props.pageSetup.pageSetup && Pages.SEARCH in this.props.pageSetup.pageSetup.pages) {
            navButtons.push(<Link to={"/search"} className={this.props.classes.link} key={'headerLinkSearch'}>
                <IconButton
                    color="secondary">
                    <Search/>
                </IconButton>
            </Link>);
        }

        return (this.wrapInHideOnScroll(<AppBar
                    position={'fixed'}
                    className={classNames(this.props.classes.appBar)}>
                    <Toolbar>
                        <Link to={"/"} className={this.props.classes.flexLink}>
                            <Avatar className={this.props.classes.logo}>
                                <CommentOutlined className={this.props.classes.titleIcon}/>
                            </Avatar>
                            <Typography variant={'h6'} color={'inherit'} noWrap classes={{
                                root: this.props.classes.title
                            }}>
                                <Hidden smDown>
                                    {this.props.localize('title')}
                                </Hidden>
                                <Hidden mdUp>
                                    {this.getMobileTitle()}
                                </Hidden>
                            </Typography>
                        </Link>
                        <div className={this.props.classes.grow}/>
                        <Hidden smDown>
                            <div className={{root: this.props.classes.sectionDesktop}}>
                                {navButtons}
                                <Link to={"/login"} className={this.props.classes.link}>
                                    <IconButton
                                        color="secondary">
                                        <AccountCircle/>
                                    </IconButton>
                                </Link>
                            </div>
                        </Hidden>
                        <Hidden mdUp>
                            <NavMenuPopover localize={this.props.localize} pages={this.props.pageSetup.pageSetup ? this.props.pageSetup.pageSetup.pages : {}}/>
                        </Hidden>
                    </Toolbar>
            {this.props.loading ? <LinearProgress color={"primary"} className={this.props.classes.progressBar}
                                                  classes={{colorPrimary: this.props.classes.progressBarColor}}/> : null
            }</AppBar>)
        )
    }
}

export default withWidth()(connect()(withLocalization(withStyles(styles, {withTheme: true})(Header))));