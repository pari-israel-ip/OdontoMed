import axios from 'axios';

const LOGIN_API_URL = 'http://localhost:8000/odomed/login/';

const loginService = {
    login: (email, contrasenia) => axios.post(LOGIN_API_URL, { email, contrasenia }),
};

export default loginService;
