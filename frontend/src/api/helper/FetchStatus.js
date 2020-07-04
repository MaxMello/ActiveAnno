// @flow

import type {Dictionary} from "../../types/Types";

/**
 * Used for http requests, storing the current state of a request in the state. This can be used to display loading
 * animations, error / success messages etc.
 */
const FetchStatus: Dictionary<string, number> = {
    SUCCESS: 0,
    ACTIVE: 1,
    ERROR: 2
};

Object.freeze(FetchStatus);

export default FetchStatus;