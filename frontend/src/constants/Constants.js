// @flow

export const WEB_DATABASE: string = process.env.REACT_APP_DATABASE ? process.env.REACT_APP_DATABASE : "activeannodb";

export const AUTHENTICATION_SERVICE_URL: string = process.env.REACT_APP_AUTHENTICATION_SERVICE_URL ? process.env.REACT_APP_AUTHENTICATION_SERVICE_URL : "";

export const ACTIVE_ANNO_SERVICE_URL: string = `${process.env.REACT_APP_ACTIVE_ANNO_SERVICE_URL ? process.env.REACT_APP_ACTIVE_ANNO_SERVICE_URL : 'http://localhost:8080/api/v1'}`;

export const GENERATE_SUPERUSER_ON_LOGIN: boolean = process.env.REACT_APP_GENERATE_SUPERUSER_ON_LOGIN ? process.env.REACT_APP_GENERATE_SUPERUSER_ON_LOGIN : true;


export const PRIMARY_COLOR = {
    main: process.env.REACT_APP_COLOR_PRIMARY_MAIN ? process.env.REACT_APP_COLOR_PRIMARY_MAIN : "#9A334F",
    light: process.env.REACT_APP_COLOR_PRIMARY_LIGHT ? process.env.REACT_APP_COLOR_PRIMARY_LIGHT : "#C1607A",
    mediumDark: process.env.REACT_APP_COLOR_PRIMARY_MEDIUM_DARK ? process.env.REACT_APP_COLOR_PRIMARY_MEDIUM_DARK : "#74132D",
    dark: process.env.REACT_APP_COLOR_PRIMARY_DARK ? process.env.REACT_APP_COLOR_PRIMARY_DARK : "#4D0015",
    contrastText: process.env.REACT_APP_COLOR_PRIMARY_CONTRAST_TEXT ? process.env.REACT_APP_COLOR_PRIMARY_CONTRAST_TEXT : "#ffffff",
};

export const SECONDARY_COLOR = {
    main: process.env.REACT_APP_COLOR_SECONDARY_MAIN ? process.env.REACT_APP_COLOR_SECONDARY_MAIN : "#423075",
    light: process.env.REACT_APP_COLOR_SECONDARY_LIGHT ? process.env.REACT_APP_COLOR_SECONDARY_LIGHT : "#625192",
    mediumDark: process.env.REACT_APP_COLOR_SECONDARY_MEDIUM_DARK ? process.env.REACT_APP_COLOR_SECONDARY_MEDIUM_DARK : "#281758",
    dark: process.env.REACT_APP_COLOR_SECONDARY_DARK ? process.env.REACT_APP_COLOR_SECONDARY_DARK : "#14063A",
    contrastText: process.env.REACT_APP_COLOR_SECONDARY_CONTRAST_TEXT ? process.env.REACT_APP_COLOR_SECONDARY_CONTRAST_TEXT : "#ffffff",
};

export const SUCCESS_COLOR = {
    main: process.env.REACT_APP_COLOR_SUCCESS_MAIN ? process.env.REACT_APP_COLOR_SUCCESS_MAIN : "#85BC5E",
};