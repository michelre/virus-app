import axios from 'axios'

class Api {

    constructor() {
        this.axios = axios;
        const token = localStorage.getItem('token-virus')
        if(token){
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
        }
    }

    signin(data) {
        return this.axios.post('/api/users/signin', data)
            .then(({data}) => {
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.token
                return data;
            })
    }

    signup(data) {
        return this.axios.post('/api/users/signup', data)
            .then(({data}) => {
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.token
                return data;
            })
    }

    getUser() {
        return this.axios.get('/api/users/me').then(({data}) => data, () => null)
    }

    fetchAllCountries() {
        return this.axios.get('/api/data/countries')
            .then(({data}) => data)
            .catch((e) => {
                //console.log(e)
            })
    }

    getDailyByCountry(query){
        return this.axios.get('/api/data/daily-by-country' + query)
            .then(({data}) => data)
            .catch((e) => {
                //console.log(e)
            })
    }

}

export default new Api()