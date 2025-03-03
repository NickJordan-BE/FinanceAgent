import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:5000';

export const axiosCall = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
})