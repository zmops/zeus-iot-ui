import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { getCookie } from '@/api/deviceMgr'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        commit('SET_NAME', data.name)
        localStorage.setItem('username', data.name)
        localStorage.setItem('userid', data.userId)
        setToken(data.token)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
      getCookie().then((r) => {
        localStorage.setItem('zbx_session', r.data)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // getInfo().then(response => {
      //   const { data } = response
      //   if (!data) {
      //     return reject('验证失败,请重新登录.')
      //   }
        // const { name, avatar } = data
        // state.dispatch('permission/generateRoutes')
        // commit('SET_NAME', name)
        // commit('SET_AVATAR', avatar)
      //   resolve(data)
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },
  getMember({ commit, dispatch }) {
    return new Promise((resolve) => {
      getInfo().then((response) => {
        if (response) {
          dispatch(
            'permission/generateRoutes',
            response.data.menu,
            {
              root: true
            }
          )
        }
        resolve()
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

