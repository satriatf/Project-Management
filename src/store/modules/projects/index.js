// Projects Store Module
const state = {
  projects: [
    {
      id: 1,
      ticketNo: '1',
      name: 'New Audit Management System - Phase 1.1',
      status: 'UAT DONE',
      technicalLead: 'Ammar',
      pic: ['Satria Tri Ferdiansyah'],
      startDate: '2025-10-01',
      endDate: '2025-10-31',
      totalDays: 30,
      percentDone: 100
    },
    {
      id: 2,
      ticketNo: '2',
      name: 'New Audit Management System - Phase 1.2',
      status: 'DROP',
      technicalLead: 'Bimo',
      pic: ['Satria Tri Ferdiansyah'],
      startDate: '2025-09-23',
      endDate: '2025-09-30',
      totalDays: 7,
      percentDone: 100
    }
  ]
}

const getters = {
  allProjects: (state) => state.projects,
  projectById: (state) => (id) => state.projects.find(proj => proj.id === id)
}

const mutations = {
  SET_PROJECTS(state, projects) {
    state.projects = projects
  },
  ADD_PROJECT(state, project) {
    state.projects.push(project)
  },
  UPDATE_PROJECT(state, updatedProject) {
    const index = state.projects.findIndex(proj => proj.id === updatedProject.id)
    if (index !== -1) {
      state.projects.splice(index, 1, updatedProject)
    }
  },
  DELETE_PROJECT(state, id) {
    state.projects = state.projects.filter(proj => proj.id !== id)
  }
}

const actions = {
  fetchProjects({ commit }) {
    // API call would go here
  },
  addProject({ commit }, project) {
    commit('ADD_PROJECT', project)
  },
  updateProject({ commit }, project) {
    commit('UPDATE_PROJECT', project)
  },
  deleteProject({ commit }, id) {
    commit('DELETE_PROJECT', id)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
