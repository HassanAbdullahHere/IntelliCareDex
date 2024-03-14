import { BASE_URL } from './Environment'
export const AUTHORIZE = 'AUTHORIZE'
export const NETWORK_ERROR = 'NETWORK ERROR'

export const Method = {
    "GET": 'GET',
    "POST": 'POST',
    "PUT": 'PUT',
    "DELETE": 'DELETE',
}

export const Status = {
    "SUCCESS": 200,
    "ERROR": 400,
    "AUTHENTICATION_FAIL": 401,
    "NOT_FOUND": 400,
}

var defaultHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
}



export const callApi = async (endPoint, method, data, accessToken, multipart) => {
    var url = BASE_URL + endPoint
    if (multipart) {
        defaultHeaders['Content-Type'] = 'multipart/form-data'
    }
    else {
        defaultHeaders['Content-Type'] = 'application/json'
    }

    if (accessToken) {
        defaultHeaders['Authorization'] = accessToken

    }
    try {
        let response = await fetch(url, {
            method: method,
            headers: defaultHeaders,
            body: method == 'GET' ? null : method == 'DELETE' ? null : multipart ? data : JSON.stringify(data),
        })
        let responseJson = await response.json()
        return responseJson
    } catch (error) {
        console.log('error:', error)
    }
}

export const fetchData = async (uri, method,
    data,
    multipart = false,
    accessToken

) => {
    const resData = await callApi(uri, method, data, accessToken, multipart)
    return resData
}
