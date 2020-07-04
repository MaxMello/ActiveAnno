// @flow
import {createMuiTheme, Theme} from '@material-ui/core/styles';
import {
    GREEN_TONE_COLOR,
    ORANGE_TONE_COLOR,
    PRIMARY_COLOR,
    RED_TONE_COLOR,
    SECONDARY_COLOR,
    YELLOW_GREEN_TONE_COLOR,
    YELLOW_TONE_COLOR
} from "../../constants/Constants";
import {grey} from "@material-ui/core/colors";
import color from 'color';

/************************************************************************************************
 * ActiveAnno material ui theme. Defines the main colors and typography of the app.
 *************************************************************************************************/

const palette = {
    primary: {
        light: PRIMARY_COLOR.light,
        main: PRIMARY_COLOR.main,
        dark: PRIMARY_COLOR.dark,
        contrastText: PRIMARY_COLOR.contrastText
    },
    secondary: {
        light: SECONDARY_COLOR.light,
        main: SECONDARY_COLOR.main,
        dark: SECONDARY_COLOR.dark,
        contrastText: SECONDARY_COLOR.contrastText
    },
    default: {
        light: '#c7c7c7',
        main: '#a9a9a9',
        dark: '#424242',
        contrastText: '#ffffff'
    },
    redTone: {
        light: RED_TONE_COLOR.light,
        main: RED_TONE_COLOR.main,
        dark: RED_TONE_COLOR.dark,
        contrastText: RED_TONE_COLOR.contrastText
    },
    lowSaturationRedTone: {
        light: `${color(RED_TONE_COLOR.light).lighten(0.3).hsl()}`,
        main: `${color(RED_TONE_COLOR.main).lighten(0.3).hsl()}`,
        dark: `${color(RED_TONE_COLOR.dark).lighten(0.3).hsl()}`,
        contrastText: RED_TONE_COLOR.contrastText
    },
    orangeTone: {
        light: ORANGE_TONE_COLOR.light,
        main: ORANGE_TONE_COLOR.main,
        dark: ORANGE_TONE_COLOR.dark,
        contrastText: ORANGE_TONE_COLOR.contrastText
    },
    yellowTone: {
        light: YELLOW_TONE_COLOR.light,
        main: YELLOW_TONE_COLOR.main,
        dark: YELLOW_TONE_COLOR.dark,
        contrastText: YELLOW_TONE_COLOR.contrastText
    },
    yellowGreenTone: {
        light: YELLOW_GREEN_TONE_COLOR.light,
        main: YELLOW_GREEN_TONE_COLOR.main,
        dark: YELLOW_GREEN_TONE_COLOR.dark,
        contrastText: YELLOW_GREEN_TONE_COLOR.contrastText
    },
    lowSaturationGreenTone: {
        light: `${color(GREEN_TONE_COLOR.light).lighten(0.3).hsl()}`,
        main: `${color(GREEN_TONE_COLOR.main).lighten(0.3).hsl()}`,
        dark: `${color(GREEN_TONE_COLOR.dark).lighten(0.3).hsl()}`,
        contrastText: GREEN_TONE_COLOR.contrastText
    },
    greenTone: {
        light: GREEN_TONE_COLOR.light,
        main: GREEN_TONE_COLOR.main,
        dark: GREEN_TONE_COLOR.dark,
        contrastText: GREEN_TONE_COLOR.contrastText
    }
};

/**
 * Helper function that creates JSS for different types of buttons
 */
const buttonCreator = (theme: Theme, colorObject: Object, name: string, fullWidth: boolean = false) => {
    return {
        [name]: {
            color: colorObject.dark,
            backgroundColor: `${color(colorObject.main).fade(0.9).hsl()}`,
            border: '0 !important',
            margin: 4,
            padding: theme.spacing(0, 1.5, 0, 1.5),
            '&:hover': {
                color: colorObject.contrastText,
                backgroundColor: colorObject.light,
                marginLeft: '4px !important',
                marginRight: '4px !important'
            },
            '&:not(:first-child)': {
                marginLeft: '4px !important',
                marginRight: '4px !important'
            },
            width: fullWidth ? '100% !important' : undefined,
            [theme.breakpoints.down('xs')]: !fullWidth ? {
                width: '100% !important',
            } : undefined,
            [`&$${name}Selected`]: {
                color: `${colorObject.contrastText} !important`,
                backgroundColor: `${colorObject.main} !important`
            },
            [`&$${name}Disabled`]: {
                color: `${grey[300]} !important`,
                backgroundColor: `${grey[100]} !important`
            }
        },
        [`${name}Selected`]: {

        },
        [`${name}Disabled`]: {

        }
    }
};

let theme: Theme = createMuiTheme({});
theme = createMuiTheme({
    ...theme, ...{
        palette: palette,
        buttons: {
            ...buttonCreator(theme, palette.primary, "primaryButton"),
            ...buttonCreator(theme, palette.secondary, "secondaryButton"),
            ...buttonCreator(theme, palette.default, "defaultButton"),

            ...buttonCreator(theme, palette.redTone, "redToneButton"),
            ...buttonCreator(theme, palette.orangeTone, "orangeToneButton"),
            ...buttonCreator(theme, palette.yellowTone, "yellowToneButton"),
            ...buttonCreator(theme, palette.yellowGreenTone, "yellowGreenToneButton"),
            ...buttonCreator(theme, palette.greenTone, "greenToneButton"),

            ...buttonCreator(theme, palette.lowSaturationRedTone, "lowSaturationRedToneButton"),
            ...buttonCreator(theme, palette.lowSaturationGreenTone, "lowSaturationGreenToneButton"),


            ...buttonCreator(theme, palette.primary, "primaryButtonFullWidth", true),
            ...buttonCreator(theme, palette.secondary, "secondaryButtonFullWidth", true),
            ...buttonCreator(theme, palette.default, "defaultButtonFullWidth", true),

            ...buttonCreator(theme, palette.redTone, "redToneButtonFullWidth", true),
            ...buttonCreator(theme, palette.orangeTone, "orangeToneButtonFullWidth", true),
            ...buttonCreator(theme, palette.yellowTone, "yellowToneButtonFullWidth", true),
            ...buttonCreator(theme, palette.yellowGreenTone, "yellowGreenToneButtonFullWidth", true),
            ...buttonCreator(theme, palette.greenTone, "greenToneButtonFullWidth", true),

            ...buttonCreator(theme, palette.lowSaturationRedTone, "lowSaturationRedToneButtonFullWidth", true),
            ...buttonCreator(theme, palette.lowSaturationGreenTone, "lowSaturationGreenToneButtonFullWidth", true)
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
            padding: theme.spacing(1, 2),
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
        defaultButtonGroup: {
            display: 'flex',
            flexWrap: 'wrap',
            userSelect: 'none',
            backgroundColor: 'transparent'
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
            color: palette.redTone.contrastText,
            backgroundColor: palette.redTone.main
        },
        errorButtonSelected: {
            color: palette.redTone.contrastText,
            backgroundColor: palette.redTone.dark
        }
    }
});

export default theme;