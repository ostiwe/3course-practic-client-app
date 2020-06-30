import snakecaseKeys from "snakecase-keys";
import camelcaseKeys from "camelcase-keys";
import {notification} from "antd";

enum Http {'get' = 'GET', 'post' = 'POST', 'put' = 'PUT', 'del' = "DELETE"}


type UserInfo = {
    id: number,
    workshopId: number | null
    firstName: string,
    lastName: string,
    mask: number,
}

type loginForm = {
    login: string,
    password: string
}


export class API {
    private readonly host = 'http://api.corp.loc'
    private accessToken: string | null

    constructor() {
        this.accessToken = localStorage.getItem('token')
    }

    setAccessToken(token: string): API {
        this.accessToken = token
        return this
    }

    hasAccessToken(): boolean {
        return this.accessToken !== null;
    }

    getUserInfo() {
        return this.request('/auth/info', Http.post)
    }

    login(loginForm: loginForm) {
        return this.request('/auth/login', Http.post, loginForm)
    }

    register(registerForm: object) {
        return this.request('/auth/register', Http.post, registerForm)
    }

    getAutos(page: number) {
        return this.request(`/autos/${page}`, Http.get);
    }

    getAutoStats() {
        return this.request('/stats/auto/realized', Http.get);
    }

    getModels() {
        return this.request('/models', Http.get)
    }

    getWorkshops() {
        return this.request('/workshops', Http.get)
    }

    getUsers() {
        return this.request('/users', Http.get)
    }


    removeAuto(autoID: number, page: number) {
        return this.request(`/auto/${autoID}?p=${page}`, Http.del);
    }

    convertToSnakeCase(object: object): object {
        return snakecaseKeys(object, {deep: true})
    }

    convertToCamelCase(object: object): object {
        return camelcaseKeys(object, {deep: true, exclude: [new RegExp("[0-9]{2}.[0-9]{2}.[0-9]{4}")]})
    }

    serialiseObject(obj: any): string {
        let pairs = []
        for (let prop in obj) {
            if (!obj.hasOwnProperty(prop)) {
                continue
            }

            if (Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                pairs.push(this.serialiseObject(obj[prop]))
                continue
            }

            pairs.push(prop + '=' + obj[prop]);
        }
        return pairs.join('&')
    }

    request(path: string, method: Http, data: object = {}) {
        return new Promise((resolve, reject) => {
            let requestSender = new XMLHttpRequest();


            if (method === Http.get && Object.keys(data).length > 0) {
                let query = this.serialiseObject(data);
                requestSender.open(method, this.host + path + `?${query}`)
            } else requestSender.open(method, this.host + path)

            if (this.accessToken != null) {
                requestSender.setRequestHeader('X-AUTH-TOKEN', this.accessToken)
            }
            if (method !== Http.get) {
                requestSender.setRequestHeader('Content-type', 'application/json')
            }

            requestSender.onload = () => {
                const jsonResponse = JSON.parse(requestSender.response);
                const convertedObject = this.convertToCamelCase(jsonResponse);
                if (Object.keys(convertedObject).includes('error')) {
                    reject(convertedObject)
                }
                resolve(convertedObject)
            }

            requestSender.onerror = () => {
                notification.error({
                    message: 'Ошибка при выполнении запроса',
                })
                reject(requestSender.response)
            }
            if (method !== Http.get) {
                const requestData = this.convertToSnakeCase(data)
                requestSender.send(JSON.stringify(requestData))
            } else requestSender.send()

        })
    }
}
