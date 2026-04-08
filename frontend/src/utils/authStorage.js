const USER_TOKEN_KEY = 'userToken';
const CAPTAIN_TOKEN_KEY = 'captainToken';
const LEGACY_TOKEN_KEY = 'token';

export function getUserToken() {
    return localStorage.getItem(USER_TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY);
}

export function setUserToken(token) {
    localStorage.removeItem(CAPTAIN_TOKEN_KEY);
    localStorage.setItem(USER_TOKEN_KEY, token);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
}

export function clearUserToken() {
    localStorage.removeItem(USER_TOKEN_KEY);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
}

export function getCaptainToken() {
    return localStorage.getItem(CAPTAIN_TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY);
}

export function setCaptainToken(token) {
    localStorage.removeItem(USER_TOKEN_KEY);
    localStorage.setItem(CAPTAIN_TOKEN_KEY, token);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
}

export function clearCaptainToken() {
    localStorage.removeItem(CAPTAIN_TOKEN_KEY);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
}
