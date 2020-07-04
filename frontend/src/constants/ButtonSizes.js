// @flow
import type {Dictionary} from "../types/Types";
import {$Keys} from "utility-types";

export const ButtonSizes: Dictionary<string, string> = {
    SMALL: "small",
    MEDIUM: "medium",
    LARGE: "large"
};

export type ButtonSize = $Keys<typeof ButtonSizes>;