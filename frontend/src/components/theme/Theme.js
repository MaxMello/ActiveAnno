// @flow
import {createMuiTheme} from '@material-ui/core/styles';
import {PRIMARY_COLOR, SECONDARY_COLOR, SUCCESS_COLOR} from "../../constants/Constants";
import {grey} from "@material-ui/core/colors";
import color from 'color';

/************************************************************************************************
 * Create the ActiveAnno material ui theme. Defines the main colors and typography of the app.
 *************************************************************************************************/

let theme: Object = createMuiTheme({});
theme = createMuiTheme({
    ...theme, ...{
        palette: {
            primary: {
                light: PRIMARY_COLOR.light,
                main: PRIMARY_COLOR.main,
                dark: PRIMARY_COLOR.dark,
                contrastText: PRIMARY_COLOR.contrastText,
                mediumDark: PRIMARY_COLOR.mediumDark
            },
            secondary: {
                light: SECONDARY_COLOR.light,
                main: SECONDARY_COLOR.main,
                dark: SECONDARY_COLOR.dark,
                contrastText: SECONDARY_COLOR.contrastText,
                mediumDark: SECONDARY_COLOR.mediumDark
            },
            success: {
                main: SUCCESS_COLOR.main
            },
            background: {
                main: '#E7E8E9'
            }
        },
        typography: {
            useNextVariants: true,
            fontFamily: [
                'Barlow',
                'sans-serif'
            ],
            h5: {
                fontSize: '1.2rem'
            }
        },
        pageRoot: {
            padding: '2vh',
            marginTop: 64,
            width: '100%'
        },
        link: {
            color: 'inherit',
            textDecoration: 'inherit',
        },
        interactionCaption: {
            userSelect: 'none',
            paddingLeft: theme.spacing(1),
            color: 'rgba(0, 0, 0, 0.54)'
        },
        interactionHeader: {
            userSelect: 'none',
            paddingLeft: theme.spacing(1)
        },
        defaultFormControl: {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1)
        },
        defaultFullWidthFormControl: {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
            width: '100%',
            flexGrow: 1
        },
        defaultDropDown: {
            width: '100%',
            flexGrow: 1,
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1) 
        },
        defaultFullWidthButtonGroup: {
            display: 'flex',
            flexWrap: 'nowrap',
            userSelect: 'none',
            backgroundColor: 'transparent',
            [theme.breakpoints.down('xs')]: {
                flexWrap: 'wrap',
            },
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1)
        },
        defaultFullWidthToggleButton: {
            color: `${SECONDARY_COLOR.main} !important`,
            backgroundColor: grey[100],
            border: '0 !important',
            paddingTop: theme.spacing(0.75),
            paddingBottom: theme.spacing(0.75),
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
            flowGrow: 1,
            margin: theme.spacing(0.5),
            '&:hover': {
                backgroundColor: grey[200],
                marginLeft: '4px !important',
                marginRight: '4px !important'
            },
            '&:not(:first-child)': {
                marginLeft: '4px !important',
                marginRight: '4px !important'
            },
            width: '100% !important'
        },
        defaultButtonGroup: {
            display: 'flex',
            flexWrap: 'wrap',
            userSelect: 'none',
            backgroundColor: 'transparent'
        },
        defaultToggleButton: {
            color: `${SECONDARY_COLOR.main} !important`,
            backgroundColor: grey[100],
            border: '0 !important',
            paddingTop: theme.spacing(0.75),
            paddingBottom: theme.spacing(0.75),
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
            flowGrow: 1,
            margin: theme.spacing(0.5),
            '&:hover': {
                backgroundColor: grey[200],
                marginLeft: '4px !important',
                marginRight: '4px !important'
            },
            '&:not(:first-child)': {
                marginLeft: '4px !important',
                marginRight: '4px !important'
            },
            [theme.breakpoints.down('xs')]: {
                width: '100% !important',
            }
        },
        defaultToggleButtonSelected: {
            color: `${SECONDARY_COLOR.main} !important`,
            backgroundColor: `${color(SECONDARY_COLOR.light).lighten(0.95).hex()} !important`
        },
        defaultToggleButtonDisabled: {
            color: 'rgba(0, 0, 0, 0.33) !important'
        },
        defaultChipInput: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            marginTop: theme.spacing(3),
            marginBottom: theme.spacing(1)
        },
        defaultPopoverContent: {
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2)
        },
        errorButton: {
            color: theme.palette.error.contrastText,
            backgroundColor: theme.palette.error.dark
        },
        errorButtonSelected: {
            color: theme.palette.error.contrastText,
            backgroundColor: `${color(theme.palette.error.dark).darken(0.2).hex()} !important`
        },
    }
});

export default theme;