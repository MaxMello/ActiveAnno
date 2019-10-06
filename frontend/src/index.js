import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import localforage from 'localforage';
import './index.css';
import {persistReducer, persistStore} from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';
import {createCookieMiddleware} from 'redux-cookie';
import cookies from 'js-cookie';
import createSagaMiddleware from 'redux-saga';
import {applicationReducer} from './redux/application';
import {authentication, onGetJWT} from './redux/authentication';
import {all} from 'redux-saga/effects';
import type {AllEffect, GenericAllEffect} from 'redux-saga/effects';
import AppWrapper from "./components/App";
import {onStartLoad, pageSetupReducer, periodicRefreshPageSetup} from "./redux/pageSetup";
import {annotationConfigReducer, onLoadAnnotationConfig, onLoadAnnotationConfigList} from "./redux/annotationConfig";
import {annotationDataReducer, onLoadAnnotationData, sendFinishedAnnotations} from "./redux/annotationData";
import {refreshAnnotationPageSaga} from "./redux/annotation";
import {curationConfigReducer, onLoadCurationConfig, onLoadCurationConfigList} from "./redux/curationConfig";
import {curationDataReducer, onLoadCurationData, sendFinishedCurations} from "./redux/curationData";
import {refreshCurationPageSaga} from "./redux/curation";
import {manageReducer, onCreateConfig, onLoadManageConfig, onLoadManageConfigList, onSaveConfig} from "./redux/manage";
import {WEB_DATABASE} from "./constants/Constants";

/************************************************************************************************
 * 1. Web app database configuration
 *
 * [LocalForage]{@link https://github.com/localForage/localForage} is used for the storage of
 * the redux in a web database. Keep in mind, that redux which should not be persisted
 * must be added to the blacklist of the rootPersistConfig constant.
 * The database name is passed via the environment variables.
 ************************************************************************************************/

localforage.config({
    name: WEB_DATABASE,
    version: 1.0,
    size: 4980736,
    storeName: WEB_DATABASE
});

const applicationPersistConfig = {
    key: `${WEB_DATABASE}.application`,
    storage: localforage,
    blacklist: []
};

const authenticationPersistConfig = {
    key: `${WEB_DATABASE}.authentication`,
    storage: localforage,
    blacklist: ['fetchStatus']
};

const annotationConfigPersistConfig = {
    key: `${WEB_DATABASE}.annotationConfig`,
    storage: localforage,
    blacklist: ['listFetchStatus', 'configFetchStatus']
};

const annotationDataPersistConfig = {
    key: `${WEB_DATABASE}.annotationData`,
    storage: localforage,
    blacklist: ['fetchStatus']
};

const curationConfigPersistConfig = {
    key: `${WEB_DATABASE}.curationConfig`,
    storage: localforage,
    blacklist: ['listFetchStatus', 'configFetchStatus']
};

const curationDataPersistConfig = {
    key: `${WEB_DATABASE}.curationData`,
    storage: localforage,
    blacklist: ['fetchStatus']
};

const pageSetupPersistConfig = {
    key: `${WEB_DATABASE}.pageSetup`,
    storage: localforage,
    blacklist: ['fetchStatus']
};

const managePersistConfig = {
    key: `${WEB_DATABASE}.manage`,
    storage: localforage,
    blacklist: ['listFetchStatus', 'configFetchStatus']
};

/************************************************************************************************
 * 2. Sagas
 ************************************************************************************************/

const sagaMiddleware = createSagaMiddleware();

/************************************************************************************************
 * 3. Create redux
 *
 * All redux must be registered here. Reducer can be made persistent via
 * [redux-persist]{@link https://github.com/rt2zz/redux-persist}.
 ************************************************************************************************/

const reducer = combineReducers({
        application: persistReducer(applicationPersistConfig, applicationReducer),
        authentication: persistReducer(authenticationPersistConfig, authentication),
        pageSetup: persistReducer(pageSetupPersistConfig, pageSetupReducer),
        annotationConfig: persistReducer(annotationConfigPersistConfig, annotationConfigReducer),
        annotationData: persistReducer(annotationDataPersistConfig, annotationDataReducer),
        curationConfig: persistReducer(curationConfigPersistConfig, curationConfigReducer),
        curationData: persistReducer(curationDataPersistConfig, curationDataReducer),
        manage: persistReducer(managePersistConfig, manageReducer)
});

/************************************************************************************************
 * 4. Create middleware
 *
 * All redux middleware which should run must be registered here.
 * Default: Redux Saga, Cookie middleware and Web Socket middleware
 ************************************************************************************************/

const middleware = applyMiddleware(sagaMiddleware, createCookieMiddleware(cookies));

/************************************************************************************************
 * 5. Create redux store
 ************************************************************************************************/

const store = createStore(reducer, middleware);


/************************************************************************************************
 * 6. Run root saga
 *
 * The saga middleware must be created before the store is created, but the saga itself must
 * be run after the store creation.
 ************************************************************************************************/
const rootSaga = function*(): Generator<AllEffect, GenericAllEffect<any>, any> {
    yield all([onGetJWT(), onStartLoad(), periodicRefreshPageSetup(),
        onLoadAnnotationConfigList(), onLoadAnnotationConfig(), onLoadAnnotationData(), refreshAnnotationPageSaga(), sendFinishedAnnotations(),
        onLoadCurationConfigList(), onLoadCurationConfig(), onLoadCurationData(), refreshCurationPageSaga(), sendFinishedCurations(),
        onLoadManageConfigList(), onLoadManageConfig(), onCreateConfig(), onSaveConfig()])
};
sagaMiddleware.run(rootSaga);

/************************************************************************************************
 * 7. Render web app
 *
 * The WebApp is surrounded by the redux provider component and the PersistGate, which rehydrates
 * the store after the page is loaded.
 ************************************************************************************************/

ReactDOM.render(
    <Provider store={store}>
        <PersistGate persistor={persistStore(store, null)}>
            <AppWrapper/>
        </PersistGate>
    </Provider>,
    document.getElementById('root'));
