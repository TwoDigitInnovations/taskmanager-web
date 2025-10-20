
const AUTH_TOKEN = '@token';
import Cookies from "js-cookie";
// -----------Auth Token------
export const getAuthToken = async () => {
    try {
        const token = Cookies.get(AUTH_TOKEN)
        return token != null ? JSON.parse(token) : null;
    } catch (e) {
        return null;
    }
};

export const setAuthToken = async (value) => {
    try {
        const token = JSON.stringify(value);
        Cookies.set(AUTH_TOKEN, token, { expires: 7, path: '' })
        return true;
    } catch (e) {
        return false;
    }
};

export const deleteAuthToken = async () => {
    try {
        Cookies.remove(AUTH_TOKEN)
        return true;
    } catch (e) {
        return false;
    }
};

export const setData = async (name, value) => {
    try {
        Cookies.set(name, JSON.stringify(value))
        return true;
    } catch (e) {
        return false;
    }
};

export const getData = async (name) => {
    try {
        const data = Cookies.get(name)
        return name != null ? JSON.parse(data) : null;
    } catch (e) {
        return false;
    }
};

export const removeData = async (name) => {
    try {
        return Cookies.remove(name);
    } catch (e) {
        return false;
    }
};
