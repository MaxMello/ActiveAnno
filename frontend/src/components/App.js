// @flow
import React, {Component} from 'react';
import {Route, BrowserRouter, Switch, withRouter} from 'react-router-dom';
import {MuiThemeProvider, withStyles} from '@material-ui/core/styles';
import theme from './theme/Theme';
import ScrollToTop from './helper/ScrollToTop';
import {LocalizationProvider} from 'react-localize';
import dictionary from '../language/dictionary';
import Header from './elements/Header';
import LandingPage from './pages/LandingPage'
import LoginPage from "./pages/LoginPage";
import {connect} from "react-redux";
import {Pages, RequestPageSetupActions} from "../redux/pageSetup";
import AnnotatePage from "./pages/AnnotatePage";
import CuratePage from "./pages/CuratePage";
import ManagePage from "./pages/ManagePage";
import AdminPage from "./pages/AdminPage";
import FetchStatus from "../api/FetchStatus";
import SearchPage from "./pages/SearchPage";
import type {AuthenticationState} from "../types/AuthenticationTypes";
import type {PageSetupState} from "../types/PageSetupTypes";
import type {AppState, WithRouterComponentProps, WithStylesComponentProps} from "../types/Types";
import EditProjectPage from "./pages/EditProjectPage";

type AppProps = WithRouterComponentProps & WithStylesComponentProps & {
    language: string,
    authentication: AuthenticationState,
    pageSetup: PageSetupState,
    loading: boolean,
    loadPageSetup: Function
}

const style: Function = (theme: Object): Object => ({
    root: {
        display: 'flex'
    }
});

class App extends Component<AppProps> {

    static checkLogin(props: AppProps) {
        if(!props.authentication.jwt && !props.history.location.pathname.startsWith("/login")) {
            props.history.push(`/login/${props.history.location.pathname.replace("/", "")}`)
        }
    }

    componentDidMount() {
        App.checkLogin(this.props)
    }

    componentWillReceiveProps(nextProps: AppProps) {
        App.checkLogin(nextProps)
    }

    componentDidUpdate() {
        if(this.props.authentication.jwt !== null &&
            !this.props.pageSetup.pageSetup &&
            this.props.pageSetup.fetchStatus === null) {
            this.props.loadPageSetup();
        }
    }

    dynamicRoutes() {
        const routes = [];
        if(this.props.pageSetup.pageSetup && Pages.ANNOTATE in this.props.pageSetup.pageSetup.pages) {
            routes.push(<Route exact path='/annotate' key={'routeAnnotate'} component={AnnotatePage}/>);
        }
        if(this.props.pageSetup.pageSetup && Pages.CURATE in this.props.pageSetup.pageSetup.pages) {
            routes.push(<Route exact path='/curate' key={'routeCurate'} component={CuratePage}/>);
        }
        if(this.props.pageSetup.pageSetup && Pages.MANAGE in this.props.pageSetup.pageSetup.pages) {
            routes.push(<Route exact path='/manage/new_project/:step?' key={'routeManageNewProject'}  component={EditProjectPage}/>);
        }
        if(this.props.pageSetup.pageSetup && Pages.MANAGE in this.props.pageSetup.pageSetup.pages) {
            routes.push(<Route exact path='/manage/project/:id/:step?' key={'routeManageEditProject'}  component={EditProjectPage}/>);
        }
        if(this.props.pageSetup.pageSetup && Pages.MANAGE in this.props.pageSetup.pageSetup.pages) {
            routes.push(<Route exact path='/manage' key={'routeManage'}  component={ManagePage}/>);
        }
        if(this.props.pageSetup.pageSetup && Pages.ADMIN in this.props.pageSetup.pageSetup.pages) {
            routes.push(<Route exact path='/admin' key={'routeAdmin'} component={AdminPage}/>);
        }
        if(this.props.pageSetup.pageSetup && Pages.SEARCH in this.props.pageSetup.pageSetup.pages) {
            routes.push(<Route exact path='/search' key={'routeSearch'} component={SearchPage}/>);
        }
        return routes;
    }

    render() {
        const dynamicRoutes = this.dynamicRoutes();
        return (
                <ScrollToTop>
                    <LocalizationProvider messages={dictionary[this.props.language]}>
                        <Route render={({location}) => (
                            <MuiThemeProvider theme={theme}>
                                <div className={this.props.classes.root}>
                                    <Header history={this.props.history} pageSetup={this.props.pageSetup} loading={this.props.loading}/>
                                    <Switch key={location.key} location={location}>
                                        <Route exact path='/' component={LandingPage}/>
                                        <Route path='/login/:origin?' component={LoginPage}/>
                                        {dynamicRoutes}
                                    </Switch>
                                </div>
                            </MuiThemeProvider>)}/>
                    </LocalizationProvider>
                </ScrollToTop>
        );
    }
}

const mapStateToProps = (state: AppState): Object => {
    return {
        language: state.application.language.selected,
        authentication: state.authentication,
        pageSetup: state.pageSetup,
        loading: (state.authentication.fetchStatus === FetchStatus.ACTIVE || state.pageSetup.fetchStatus === FetchStatus.ACTIVE
        || state.annotationConfig.configFetchStatus === FetchStatus.ACTIVE || state.annotationConfig.listFetchStatus === FetchStatus.ACTIVE)
    };
};

const mapDispatchToProps = (dispatch: Function): Object => ({
    loadPageSetup: () => {
        dispatch(RequestPageSetupActions.start());
    }
});

const AppComponent = withRouter(withStyles(style)(connect(mapStateToProps, mapDispatchToProps)(App)));

/**
 * Wrapper component so we can use withRouter() in App component
 */
class AppWrapper extends Component<Object> {
    render() {
        return (
            <BrowserRouter>
                <AppComponent authentication={this.props.authentication}
                                        language={this.props.language}
                                        pageSetup={this.props.pageSetup}
                />
            </BrowserRouter>
        );
    }
}

export default AppWrapper;