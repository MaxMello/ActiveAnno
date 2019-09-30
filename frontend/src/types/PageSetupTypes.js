import type {Dictionary, userIdentifier} from "./Types";

export type Page = {
    badgeCount?: number
}

export type UserInfo = {
    userIdentifier: string,
    userName?: string
}

export type PageSetup = {
    pages: Dictionary<string, Page>,
    userInfo: Dictionary<userIdentifier, UserInfo>
}

export type PageSetupState = {
    pageSetup: PageSetup,
    fetchStatus: number
}