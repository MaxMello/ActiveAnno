// @flow
import type {UserIdentifier} from "../Types";
import type {JWT} from "../AuthenticationTypes";

export type AuthenticationState = {|
    jwt: ?JWT,
    fetchStatus: ?number,
    username: ?UserIdentifier
|}