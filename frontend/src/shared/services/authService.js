import HttpClient from "core/HttpClient";

const authService = {
    signIn: (data)=> {
        return HttpClient.post('/auth/sign-in', { body: data })
    },
    signUp: (data)=> {
        return HttpClient.post('/auth/sign-up', { body: data })
    },
}

export default authService;