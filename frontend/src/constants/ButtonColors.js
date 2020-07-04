// @flow
import type {Dictionary} from "../types/Types";
import {$Keys} from "utility-types";

export const ButtonColors: Dictionary<string, string> = {
    DEFAULT: "defaultButton",
    PRIMARY: "primaryButton",
    SECONDARY: "secondaryButton",
    RED_TONE: "redToneButton",
    LOW_SATURATION_RED_TONE: "lowSaturationRedToneButton",
    ORANGE_TONE: "orangeToneButton",
    YELLOW_TONE: "yellowToneButton",
    YELLOW_GREEN_TONE: "yellowGreenToneButton",
    LOW_SATURATION_GREEN_TONE: "lowSaturationGreenToneButton",
    GREEN_TONE: "greenToneButton"
};

export type ButtonColor = $Keys<typeof ButtonColors>;

export const selectedColorButton = (buttonColor: string) => {
    return `${buttonColor}Selected`
};

export const disabledColorButton = (buttonColor: string) => {
    return `${buttonColor}Disabled`
};

export const fullWidthColorButton = (buttonColor: string) => {
    return `${buttonColor}FullWidth`
};

export const selectedFullWidthColorButton = (buttonColor: string) => {
    return `${buttonColor}FullWidthSelected`
};

export const disabledFullWidthColorButton = (buttonColor: string) => {
    return `${buttonColor}FullWidthDisabled`
};