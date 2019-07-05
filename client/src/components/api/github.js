import axios from 'axios';

export default axios.create(
    {
        baseURL : 'https://api.github.com/',
        params: { 
            sort: 'stars',
            order: 'desc'
        } 
    });