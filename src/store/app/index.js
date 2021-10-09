import { $themeBreakpoints } from '@themeConfig'

const axios = require('axios')
import { $apiURL } from '@projectConfig'

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['x-access-token'] = localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo')).success
                                                    ? JSON.parse(localStorage.getItem('userInfo')).accessToken 
                                                    : null;


export default {
    namespaced: true,
    state: {
        windowWidth: 0,
        shallShowOverlay: false,
    },
    getters: {
        currentBreakPoint: state => {
            const { windowWidth } = state
            if (windowWidth >= $themeBreakpoints.xl) return 'xl'
            if (windowWidth >= $themeBreakpoints.lg) return 'lg'
            if (windowWidth >= $themeBreakpoints.md) return 'md'
            if (windowWidth >= $themeBreakpoints.sm) return 'sm'
            return 'xs'
        },
    },
    mutations: {
        UPDATE_WINDOW_WIDTH(state, val) {
            state.windowWidth = val
        },
        TOGGLE_OVERLAY(state, val) {
            state.shallShowOverlay = val !== undefined ? val : !state.shallShowOverlay
        },
    },
    actions: {
        getFeePercent(context, payload) {
            return new Promise((resolve, reject) => {
                axios.post(`${$apiURL}app/getFeePercent`).then(res => {
                    resolve(res);
                }).catch(err => {
                    reject(new Error(err));
                })
            })
        },
        setFeePercent(context, payload) {
            return new Promise((resolve, reject) => {
                axios.post(`${$apiURL}app/setFeePercent`, payload).then(res => {
                    resolve(res);
                }).catch(err => {
                    reject(new Error(err));
                })
            })
        },
        addNewBadWord(context, payload) {
            return new Promise((resolve, reject) => {
                axios.post(`${$apiURL}app/addNewBadWord`, payload).then(res => {
                    resolve(res);
                }).catch(err => {
                    reject(new Error(err));
                })
            })
        },
        getBadWordList(context, payload) {
            return new Promise((resolve, reject) => {
                axios.post(`${$apiURL}app/getBadWordList`, payload).then(res => {
                    resolve(res);
                }).catch(err => {
                    reject(new Error(err));
                })
            })
        },
        getTransactions() {
            return new Promise((resolve, reject) => {
                axios.get(`${$apiURL}app/getTransactions`).then(res => {
                    resolve(res);
                }).catch(err => {
                    reject(new Error(err));
                })
            })
        }
    },
}
