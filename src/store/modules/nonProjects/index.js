// Non-Projects Store Module
const state = {
  nonProjects: [
    {
      id: 1,
      createdBy: 'Satria Tri Ferdiansyah',
      ticketNo: '1357',
      description: 'stak',
      type: 'PROBLEM',
      resolverPic: 'Satria Tri Ferdiansyah',
      solution: '',
      application: 'Ad1Forflow',
      date: '2025-10-01',
      attachment: null
    },
    {
      id: 2,
      createdBy: 'Ammar',
      ticketNo: '2468',
      description: 'anomali',
      type: 'INCIDENT',
      resolverPic: 'Bimo',
      solution: '',
      application: 'Primajaga',
      date: '2025-09-30',
      attachment: null
    }
  ]
}

const getters = {
  allNonProjects: (state) => state.nonProjects,
  nonProjectById: (state) => (id) => state.nonProjects.find(np => np.id === id)
}

const mutations = {
  SET_NON_PROJECTS(state, nonProjects) {
    state.nonProjects = nonProjects
  },
  ADD_NON_PROJECT(state, nonProject) {
    state.nonProjects.push(nonProject)
  },
  UPDATE_NON_PROJECT(state, updatedNonProject) {
    const index = state.nonProjects.findIndex(np => np.id === updatedNonProject.id)
    if (index !== -1) {
      state.nonProjects.splice(index, 1, updatedNonProject)
    }
  },
  DELETE_NON_PROJECT(state, id) {
    state.nonProjects = state.nonProjects.filter(np => np.id !== id)
  }
}

const actions = {
  fetchNonProjects({ commit }) {
    // API call would go here
  },
  addNonProject({ commit }, nonProject) {
    commit('ADD_NON_PROJECT', nonProject)
  },
  updateNonProject({ commit }, nonProject) {
    commit('UPDATE_NON_PROJECT', nonProject)
  },
  deleteNonProject({ commit }, id) {
    commit('DELETE_NON_PROJECT', id)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
