// @flow

import type {Dictionary} from "../types/Types";

export const LayoutAreaTypes: Dictionary<string, string> = {
    COMMON: "Common",
    SHARED_TARGET: "SharedTarget",
    DOCUMENT_TARGET: "DocumentTarget",
    SPAN_TARGET: "SpanTarget"
};

export type LayoutAreaType = $Values<typeof LayoutAreaTypes>;