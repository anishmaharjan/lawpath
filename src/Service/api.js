import axios from 'axios';

const API_ROOT = {
    'baseURL': 'https://digitalapi.auspost.com.au/locations/v2/',
};

const oldKey = '872608e3-4530-4c6a-a369-052accb03ca8';
const myApiKey = 'gOdcsgK41uMcyFTl1S6fcr7e5yRNRnyN';

const getHeaderConfig = () => {
    return ({
        headers: {
            'AUTH-KEY': myApiKey,
        }
    });
};

axios.defaults.headers.common['Content-Type'] = 'application/json';

const request = {
    get: url =>
        axios.get(`${API_ROOT.baseURL}${url}`, getHeaderConfig()),
    post: (url, body) =>
        axios.post(`${API_ROOT.baseURL}${url}`, body, getHeaderConfig()),
};

export default request;