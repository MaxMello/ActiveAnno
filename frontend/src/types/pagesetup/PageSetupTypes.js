// @flow
import type {Dictionary, UserIdentifier} from "../Types";

export type Page = {|
    badgeCount: ?number
|}

export type UserInfo = {|
    userIdentifier: UserIdentifier,
    userName: ?string
|}

export type PageSetup = {|
    pages: Dictionary<string, Page>,
    userInfo: Dictionary<UserIdentifier, UserInfo>
|}

