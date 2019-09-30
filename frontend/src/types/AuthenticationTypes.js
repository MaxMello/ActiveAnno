import type {userIdentifier} from "./Types";

export type UserCredentials = {
    username: string,
    password: string
}

export type JWT = {
    token: string
}

export type AuthenticationState = {
    jwt: JWT,
    fetchStatus: number,
    username: userIdentifier
}
