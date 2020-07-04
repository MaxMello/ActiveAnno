// @flow
import React, {Component} from 'react';
import {BrowserRouter, Route, Switch, withRouter} from 'react-router-dom';
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
import {AnnotatePage} from "./pages/AnnotatePage";
import {CuratePage} from "./pages/CuratePage";
import ManagePage from "./pages/ManagePage";
import AdminPage from "./pages/AdminPage";
import FetchStatus from "../api/helper/FetchStatus";
import SearchPage from "./pages/SearchPage";
import type {WithRouterComponentProps, WithStylesComponentProps} from "../types/Types";
import EditProjectPage from "./pages/EditProjectPage";
import {ROUTING_BASE_NAME} from "../constants/Constants";
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import type {AuthenticationState} from "../types/redux/AuthenticationState";
import type {PageSetupState} from "../types/redux/PageSetupState";
import type {AppState} from "../types/redux/AppState";
import {availableLanguages, LanguageActions} from "../redux/application";
import type {AnnotationDocumentInState} from "../types/redux/annotate/AnnotationDataState";
import type {CurationDocumentInState} from "../types/redux/annotate/CurationDataState";
// Additional locales need to be added here to work with moment
import * as moment from "moment";
import "moment/locale/de";
import AnalyzeProjectResultsPage from "./pages/AnalyzeProjectResultsPage";
import EditAnnotationDefinitionPage from "./pages/EditAnnotationDefinitionPage";
import type {AnnotationDefinitionInStore} from "../types/annotationdefinition/AnnotationDefinition";

type AppProps = WithRouterComponentProps & WithStylesComponentProps & {
    language: string,
    authentication: AuthenticationState,
    pageSetup: PageSetupState,
    loading: boolean,
    loadPageSetup: Function,
    selectLanguage: Function
}

const style: Function = (theme: Object): Object => ({
    root: {
        display: 'flex',
        fontFamily: 'Barlow, sans-serif'
    }
});

class App extends Component<AppProps> {

    static checkLogin(props: AppProps) {
        if(!props.authentication.jwt && !props.history.location.pathname.startsWith("/user")) {
            props.history.push(`/user/${props.history.location.pathname.replace("/", "")}`)
        }
    }

    componentDidMount() {
        App.checkLogin(this.props)
        if(this.props.language == null) {
            // Initially set languages
            const languages: Array<string> = navigator.languages.concat();
            const defaultLanguage = languages.find(l => availableLanguages.includes(l)) ?? "en";
            this.props.selectLanguage(defaultLanguage);
            moment.locale(languages);
        }
    }

    componentWillReceiveProps(nextProps: AppProps, nextContext) {
        App.checkLogin(nextProps)
    }

    componentDidUpdate() {
        if(this.props.authentication.jwt !== null &&
            !this.props.pageSetup.pageSetup &&
            this.props.pageSetup.fetchStatus === null) {
            this.props.loadPageSetup();
        }
    }

    /**
     * Routes are set dynamically based on the PageSetup from the backend
     * @returns {[]}
     */
    dynamicRoutes() {
        const routes = [];
        if(this.props.pageSetup.pageSetup && Pages.ANNOTATE in this.props.pageSetup.pageSetup.pages) {
            routes.push(<Route exact path='/annotate' key={'routeAnnotate'} component={AnnotatePage}/>);
        }
        if(this.props.pageSetup.pageSetup && Pages.CURATE in this.props.pageSetup.pageSetup.pages) {
            routes.push(<Route exact path='/curate' key={'routeCurate'} component={CuratePage}/>);
        }
        if(this.props.pageSetup.pageSetup && Pages.MANAGE in this.props.pageSetup.pageSetup.pages) {
            routes.push(<Route exact path='/manage/new_project/:step?' key={'routeManageNewProject'}
                               component={EditProjectPage}/>);
            routes.push(<Route exact path='/manage/project/:id/:step?' key={'routeManageEditProject'}
                               component={EditProjectPage}/>);
            routes.push(<Route exact path='/manage' key={'routeManage'}  component={ManagePage}/>);
            routes.push(<Route exact path='/manage/analyzeProjectResults/:id' key={'routeAnalyzeProject'}
                               component={AnalyzeProjectResultsPage}/>);
            routes.push(<Route exact path='/manage/new_annotationDefinition' key={'routeManageNewAnnotation'}
                               component={EditAnnotationDefinitionPage}/>);
            routes.push(<Route exact path='/manage/annotationDefinition/:id' key={'routeManageEditAnnotation'}
                               component={EditAnnotationDefinitionPage}/>);
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
                    <LocalizationProvider messages={this.props.language ? dictionary[this.props.language]
                        : dictionary["en"]}>
                        <Route render={({location}) => (
                            <MuiThemeProvider theme={theme}>
                                <MuiPickersUtilsProvider utils={MomentUtils}>
                                    <div className={this.props.classes.root}>
                                        <Header history={this.props.history} pageSetup={this.props.pageSetup}
                                                loading={this.props.loading}/>
                                        <Switch key={location.key} location={location}>
                                            <Route exact path='/' component={LandingPage}/>
                                            <Route path='/user/:origin?' component={LoginPage}/>
                                            {dynamicRoutes}
                                        </Switch>
                                    </div>
                                </MuiPickersUtilsProvider>
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
        /*
         * The loading animation will be shown if any fetchStatus is active
         */
        loading: (state.authentication.fetchStatus === FetchStatus.ACTIVE
            || (state.pageSetup.pageSetup == null && state.pageSetup.fetchStatus === FetchStatus.ACTIVE)
            || state.annotationProject.projectFetchStatus === FetchStatus.ACTIVE
            || state.annotationProject.listFetchStatus === FetchStatus.ACTIVE
            || state.curationProject.projectFetchStatus === FetchStatus.ACTIVE
            || state.curationProject.listFetchStatus === FetchStatus.ACTIVE
            || (((Object.values(state.annotationData.documents): Array<any>)
                .filter((d: AnnotationDocumentInState) => !d.skipped)).length === 0
                && state.annotationData.fetchStatus === FetchStatus.ACTIVE)
            || (((Object.values(state.curationData.documents): Array<any>)
                    .filter((d: CurationDocumentInState) => !d.skipped)).length === 0
                && state.curationData.fetchStatus === FetchStatus.ACTIVE)
            || state.manage.listFetchStatus === FetchStatus.ACTIVE
            || state.manage.projectFetchStatus === FetchStatus.ACTIVE
            || state.manage.projectAnalysisFetchStatus === FetchStatus.ACTIVE
            || Object.values(state.manage.uploadProjectStatus).some(fetchStatus => fetchStatus === FetchStatus.ACTIVE)
            || state.manage.annotationDefinitionFetchStatus === FetchStatus.ACTIVE
            || ((Object.values(state.manage.annotationDefinitions): any)
                .some((a: AnnotationDefinitionInStore) => a.fetchStatus === FetchStatus.ACTIVE))
        )
    }
};

const mapDispatchToProps = (dispatch: Function): Object => ({
    loadPageSetup: () => {
        dispatch(RequestPageSetupActions.start());
    },
    selectLanguage: (language: string) => {
        dispatch(LanguageActions.select(language));
    }
});

const AppComponent = withRouter(withStyles(style)(connect(mapStateToProps, mapDispatchToProps)(App)));

/**
 * Wrapper component so we can use withRouter() in App component
 */
class AppWrapper extends Component<Object> {
    render() {
        return (
            <BrowserRouter basename={ROUTING_BASE_NAME}>
                <AppComponent authentication={this.props.authentication}
                                        language={this.props.language}
                                        pageSetup={this.props.pageSetup}
                />
            </BrowserRouter>
        );
    }
}

export default AppWrapper;