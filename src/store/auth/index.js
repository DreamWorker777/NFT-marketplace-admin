const axios = require('axios')
const apiUrl = 'http://127.0.0.1:3000/api/'

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

export default {
  namespaced: true,
  state: {
    AppActiveUser : {
        genTokenDate: '',
        email: '',
        username: '',
        firstname: '',
        lastname: '',
        id: '',
        wallet: ''
    }
  },
  getters: {
    isAuthenticated: state => {
        const user = (state.AppActiveUser.id != "")? state.AppActiveUser : JSON.parse(localStorage.getItem("userInfo"));
        
        if (user) {
            const hours = Math.abs(new Date() - new Date(user.genTokenDate)) / 36e5;
            console.log('expire hours', hours);
            if(hours < 12){
                return true;
            }else{
                return false
            }
            // for Node.js Express back-end
        } else {
            return false;
        }
    },
  },
  mutations: {
    UPDATE_USER_INFO(state, payload) {
      let userInfo = JSON.parse(localStorage.getItem("userInfo")) || state.AppActiveUser
  
      for (const property of Object.keys(payload)) {
  
        if (payload[property] != null) {
          // If some of user property is null - user default property defined in state.AppActiveUser
          state.AppActiveUser[property] = payload[property]
  
          // Update key in localStorage
          userInfo[property] = payload[property]
        }
      }
      // Store data in localStorage
      userInfo['genTokenDate'] = new Date();
      
      localStorage.setItem("userInfo", JSON.stringify(userInfo))
    },
    
    UPDATE_SIGNED(state, payload) {
      const logged = localStorage.getItem("loggedState") || payload;
      localStorage.setItem('loggedState', payload);
    },
  },
  actions: {
    login(context, payload){
      return new Promise((resolve, reject) => {
        var loginData = {
          username: payload.username,
          password: payload.password,
        }
        
        axios.post(`${apiUrl}auth/signin`, loginData).then((res) => {
  
          context.commit('UPDATE_SIGNED', true);
          context.commit('UPDATE_USER_INFO', res.data);
  
          axios.defaults.headers.common['x-access-token'] = res.data.accessToken
          
          resolve(res);
        }).catch((err) => {
          console.log(err);
          reject(new Error(err));
        })
      })
    },
  },
}
