// @flow
import {
    ButtonColors,
    disabledColorButton,
    disabledFullWidthColorButton,
    fullWidthColorButton,
    selectedColorButton,
    selectedFullWidthColorButton
} from "../../constants/ButtonColors";

/**
 * For a class and color, create JSS for selected and disabled state
 */
export function colorButtonClasses(classes: any, color: string = ButtonColors.PRIMARY, fullWidth: boolean = true) {
    return {
        root: classes[fullWidth ? fullWidthColorButton(color) : color],
        selected: classes[fullWidth ? selectedFullWidthColorButton(color) : selectedColorButton(color)],
        disabled: classes[fullWidth ? disabledFullWidthColorButton(color) : disabledColorButton(color)]
    };
}