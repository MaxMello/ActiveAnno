// @flow

export type ApplicationState = {|
    language: {
        selected: ?string,
        available: Array<string>
    }
|}