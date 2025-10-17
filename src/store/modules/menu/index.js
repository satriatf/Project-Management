/* eslint-disable */
import menutreeService from '@/services/menutree.service'

import { GET_MENU_TREE, HANDLE_CLICK } from './actions.type'
import { SET_MENU_TREE, SET_MENU_TREE_DEFAULT } from './mutations.type'

const state = {
  menuTrees: [],
  menuTreesDefault: []
}

const getters = {
  menutrees(state) {
    return state.menuTrees
  },
  menuTreesDefault(state) {
    return state.menuTreesDefault
  }
}

const actions = {
  [HANDLE_CLICK](context, { page, name, index }) {
    context.commit('setActivePage', page)
    context.commit('setBreadCrumbs', name)
    context.commit('setActiveIndex', index)
    context.commit('setSubActiveIndex', '') // Reset the sub active index
  }
}
const mutations = {
  setActivePage(state, page) {
    state.activePage = page
  },
  setBreadCrumbs(state, name) {
    state.breadcrumbs = name
  },
  setActiveIndex(state, index) {
    state.activeIndex = index
  },
  setSubActiveIndex(state, index) {
    state.subActiveIndex = index
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
