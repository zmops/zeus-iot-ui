import { asyncRoutes, constantRouters, errorRouters } from '@/router'
import router from '@/router'
import { nextFirstLink } from '@/utils'

/**
 * Filter router
 * @param userRouter asyncRoutes
 * @param allRouter
 */
export function recursionRouter(userRouter = [], allRouter = []) {
  // const realRoutes = []
  // allRouter.forEach((v) => {
  //   userRouter.forEach((item) => {
  //     if (v.path && item.url === v.path) {
  //       const { children, ...x } = v
  //       if (children && children.length) {
  //         recursionRouter(userRouter, children)
  //         realRoutes.push({ children, ...x })
  //       } else {
  //         realRoutes.push(x)
  //       }
  //     }
  //   })
  // })
  // return [...realRoutes]
  allRouter.forEach((v) => {
    v.show = false
    userRouter.forEach((item) => {
      if (v.path && item.url === v.path) {
        v.show = true
        const { children } = v
        if (children && children.length) {
          recursionRouter(userRouter, children)
        }
      }
    })
  })
  return allRouter
}

const state = {
  routes: [],
  addRoutes: [],
  errorRouters: errorRouters
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRouters.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, menuList) {
    return new Promise((resolve) => {
      const accessedRoutes = recursionRouter(menuList, asyncRoutes)
      let path = '/401'
      if (accessedRoutes.length) {
        path = nextFirstLink(
          accessedRoutes
        )
      }
      accessedRoutes.push({
        path: '/',
        hidden: true,
        redirect: path
      })
      commit('SET_ROUTES', accessedRoutes)
      const activeRouter = accessedRoutes.concat(errorRouters)
      router.addRoutes(activeRouter)
      resolve(activeRouter)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
