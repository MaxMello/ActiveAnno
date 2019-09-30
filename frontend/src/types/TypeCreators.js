import type {HttpError} from "./Types";
import type {UserCredentials} from "./AuthenticationTypes";

export const httpError = (statusCode: number, statusText: string): HttpError => {
    return {
        statusCode,
        statusText
    };
};

export const userCredentials = (username: string, password: string): UserCredentials => {
    return {
        username,
        password
    }
};