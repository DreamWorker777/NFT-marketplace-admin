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
    fetchContacts() {
      return new Promise((resolve, reject) => {
        axios
          .get(`${$apiURL}chat/contacts`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    getChat(ctx, { ticketId }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`${$apiURL}chat/getChat/${ticketId}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    sendMessage(ctx, { receiverId, message }) {
      return new Promise((resolve, reject) => {
        axios
          .post(`${$apiURL}chat/sendMessage`, { message, receiverId })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
