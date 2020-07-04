// @flow
/*
 * Configurable constants through environment variables, need to be set during build time
 */

export const WEB_DATABASE: string = process.env.REACT_APP_DATABASE ? process.env.REACT_APP_DATABASE : "activeannodb";

export const AUTHENTICATION_SERVICE_URL: string = process.env.REACT_APP_AUTHENTICATION_SERVICE_URL
    ? process.env.REACT_APP_AUTHENTICATION_SERVICE_URL : "";

export const ACTIVE_ANNO_SERVICE_URL: string = `${process.env.REACT_APP_ACTIVE_ANNO_SERVICE_URL 
    ? process.env.REACT_APP_ACTIVE_ANNO_SERVICE_URL : 'http://localhost:8080/api/v1'}`;

export const GENERATE_SUPERUSER_ON_LOGIN: boolean = process.env.REACT_APP_GENERATE_SUPERUSER_ON_LOGIN
    ? JSON.parse(process.env.REACT_APP_GENERATE_SUPERUSER_ON_LOGIN) : false;

export const ROUTING_BASE_NAME: string =  process.env.REACT_APP_ROUTING_BASE_NAME
    ? process.env.REACT_APP_ROUTING_BASE_NAME : '';

export const PRIMARY_COLOR = {
    main: process.env.REACT_APP_COLOR_PRIMARY_MAIN ? process.env.REACT_APP_COLOR_PRIMARY_MAIN : "#9A334F",
    light: process.env.REACT_APP_COLOR_PRIMARY_LIGHT ? process.env.REACT_APP_COLOR_PRIMARY_LIGHT : "#C1607A",
    dark: process.env.REACT_APP_COLOR_PRIMARY_DARK ? process.env.REACT_APP_COLOR_PRIMARY_DARK : "#4D0015",
    contrastText: process.env.REACT_APP_COLOR_PRIMARY_CONTRAST_TEXT
        ? process.env.REACT_APP_COLOR_PRIMARY_CONTRAST_TEXT : "#ffffff",
};

export const SECONDARY_COLOR = {
    main: process.env.REACT_APP_COLOR_SECONDARY_MAIN ? process.env.REACT_APP_COLOR_SECONDARY_MAIN : "#423075",
    light: process.env.REACT_APP_COLOR_SECONDARY_LIGHT ? process.env.REACT_APP_COLOR_SECONDARY_LIGHT : "#625192",
    dark: process.env.REACT_APP_COLOR_SECONDARY_DARK ? process.env.REACT_APP_COLOR_SECONDARY_DARK : "#14063A",
    contrastText: process.env.REACT_APP_COLOR_SECONDARY_CONTRAST_TEXT
        ? process.env.REACT_APP_COLOR_SECONDARY_CONTRAST_TEXT : "#ffffff",
};

export const RED_TONE_COLOR = {
    main: process.env.REACT_APP_COLOR_RED_TONE_MAIN ? process.env.REACT_APP_COLOR_RED_TONE_MAIN : "#d74b53",
    light: process.env.REACT_APP_COLOR_RED_TONE_LIGHT ? process.env.REACT_APP_COLOR_RED_TONE_LIGHT : "#E8505A",
    dark: process.env.REACT_APP_COLOR_RED_TONE_DARK ? process.env.REACT_APP_COLOR_RED_TONE_DARK : "#b24048",
    contrastText: process.env.REACT_APP_COLOR_RED_TONE_CONTRAST_TEXT
        ? process.env.REACT_APP_COLOR_RED_TONE_CONTRAST_TEXT: "#ffffff",
};

export const ORANGE_TONE_COLOR = {
    main: process.env.REACT_APP_COLOR_ORANGE_TONE_MAIN ? process.env.REACT_APP_COLOR_ORANGE_TONE_MAIN : "#ea7553",
    light: process.env.REACT_APP_COLOR_ORANGE_TONE_LIGHT ? process.env.REACT_APP_COLOR_ORANGE_TONE_LIGHT : "#FF8157",
    dark: process.env.REACT_APP_COLOR_ORANGE_TONE_DARK ? process.env.REACT_APP_COLOR_ORANGE_TONE_DARK : "#d56b4d",
    contrastText: process.env.REACT_APP_COLOR_ORANGE_TONE_CONTRAST_TEXT
        ? process.env.REACT_APP_COLOR_ORANGE_TONE_CONTRAST_TEXT: "#ffffff",
};

export const YELLOW_TONE_COLOR = {
    main: process.env.REACT_APP_COLOR_YELLOW_TONE_MAIN ? process.env.REACT_APP_COLOR_YELLOW_TONE_MAIN : "#edc549",
    light: process.env.REACT_APP_COLOR_YELLOW_TONE_LIGHT ? process.env.REACT_APP_COLOR_YELLOW_TONE_LIGHT : "#FFD44F",
    dark: process.env.REACT_APP_COLOR_YELLOW_TONE_DARK ? process.env.REACT_APP_COLOR_YELLOW_TONE_DARK : "#d2ae40",
    contrastText: process.env.REACT_APP_COLOR_YELLOW_TONE_CONTRAST_TEXT
        ? process.env.REACT_APP_COLOR_YELLOW_TONE_CONTRAST_TEXT: "#ffffff",
};

export const YELLOW_GREEN_TONE_COLOR = {
    main: process.env.REACT_APP_COLOR_YELLOW_GREEN_TONE_MAIN
        ? process.env.REACT_APP_COLOR_YELLOW_GREEN_TONE_MAIN : "#aeae2c",
    light: process.env.REACT_APP_COLOR_YELLOW_GREEN_TONE_LIGHT
        ? process.env.REACT_APP_COLOR_YELLOW_GREEN_TONE_LIGHT : "#CCCC33",
    dark: process.env.REACT_APP_COLOR_YELLOW_GREEN_TONE_DARK
        ? process.env.REACT_APP_COLOR_YELLOW_GREEN_TONE_DARK : "#979726",
    contrastText: process.env.REACT_APP_COLOR_YELLOW_GREEN_TONE_CONTRAST_TEXT
        ? process.env.REACT_APP_COLOR_YELLOW_GREEN_TONE_CONTRAST_TEXT: "#ffffff",
};

export const GREEN_TONE_COLOR = {
    main: process.env.REACT_APP_COLOR_GREEN_TONE_MAIN ? process.env.REACT_APP_COLOR_GREEN_TONE_MAIN : "#40a676",
    light: process.env.REACT_APP_COLOR_GREEN_TONE_LIGHT ? process.env.REACT_APP_COLOR_GREEN_TONE_LIGHT : "#46BD89",
    dark: process.env.REACT_APP_COLOR_GREEN_TONE_DARK ? process.env.REACT_APP_COLOR_GREEN_TONE_DARK : "#3a8b60",
    contrastText: process.env.REACT_APP_COLOR_GREEN_TONE_CONTRAST_TEXT
        ? process.env.REACT_APP_COLOR_GREEN_TONE_CONTRAST_TEXT: "#ffffff",
};