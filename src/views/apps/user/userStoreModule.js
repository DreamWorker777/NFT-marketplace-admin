import axios from '@axios'
import { $apiURL } from '@projectConfig'

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['x-access-token'] = JSON.parse(localStorage.getItem('userInfo')).success
                                                    ? JSON.parse(localStorage.getItem('userInfo')).accessToken 
                                                    : null;

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchUsers(ctx, queryParams) {
        let query = queryParams;
        if( query.sortBy == 'user' )
            query.sortBy = 'username'

      return new Promise((resolve, reject) => {
        axios
          .get(`${$apiURL}user/all`, { params: query })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    fetchUser(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/apps/user/users/${id}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    addUser(ctx, userData) {
      return new Promise((resolve, reject) => {
        axios
          .post('/apps/user/users', { user: userData })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    resetPassword(ctx, userData) {
        return new Promise((reslove, reject) => {
            axios.post(`${$apiURL}user/resetPassword`, { user: userData })
                .then(response => reslove(response))
                .catch(error => reject(error))
        })
    }
  },
}
