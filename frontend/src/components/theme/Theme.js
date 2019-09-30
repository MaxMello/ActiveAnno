// @flow
import {createMuiTheme} from '@material-ui/core/styles';
import {PRIMARY_COLOR, SECONDARY_COLOR, SUCCESS_COLOR} from "../../constants/Constants";

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
        }
    }
});

export default theme;