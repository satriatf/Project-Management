import ApiService from '@/common/api.service'

// Master Data Store Module (API-backed)
const state = {
  projectStatuses: [],
  nonProjectTypes: [],
  applications: [],
  holidays: []
}

const getters = {
  activeProjectStatuses: (state) => state.projectStatuses.filter(ps => ps.deletedAt == null),
  activeNonProjectTypes: (state) => state.nonProjectTypes.filter(npt => npt.deletedAt == null),
  activeApplications: (state) => state.applications.filter(app => app.deletedAt == null),
  activeHolidays: (state) => state.holidays.filter(h => h.deletedAt == null)
}

const mutations = {
  // Fetch mutations (API data)
  SET_PROJECT_STATUSES(state, statuses) {
    state.projectStatuses = statuses
  },
  SET_NON_PROJECT_TYPES(state, types) {
    state.nonProjectTypes = types
  },
  SET_APPLICATIONS(state, applications) {
    state.applications = applications
  },
  SET_HOLIDAYS(state, holidays) {
    state.holidays = holidays
  },
  
  // Project Statuses
  ADD_PROJECT_STATUS(state, status) {
    state.projectStatuses.push(status)
  },
  SOFT_DELETE_PROJECT_STATUS(state, id) {
    // Remove from UI after soft delete in backend
    state.projectStatuses = state.projectStatuses.filter(ps => ps.id !== id)
  },
  
  // Non-Project Types
  ADD_NON_PROJECT_TYPE(state, type) {
    state.nonProjectTypes.push(type)
  },
  SOFT_DELETE_NON_PROJECT_TYPE(state, id) {
    // Remove from UI after soft delete in backend
    state.nonProjectTypes = state.nonProjectTypes.filter(npt => npt.id !== id)
  },
  
  // Applications
  ADD_APPLICATION(state, app) {
    state.applications.push(app)
  },
  SOFT_DELETE_APPLICATION(state, id) {
    // Remove from UI after soft delete in backend
    state.applications = state.applications.filter(a => a.id !== id)
  },
  
  // Holidays
  ADD_HOLIDAY(state, holiday) {
    state.holidays.push(holiday)
  },
  SOFT_DELETE_HOLIDAY(state, id) {
    // Remove from UI after soft delete in backend
    state.holidays = state.holidays.filter(h => h.id !== id)
  }
}

const actions = {
  // Fetch actions (API calls)
  async fetchProjectStatuses({ commit }) {
    try {
      const { data } = await ApiService.get('master/project-statuses')
      commit('SET_PROJECT_STATUSES', data?.data || [])
    } catch (error) {
      console.error('Failed to fetch project statuses:', error)
      commit('SET_PROJECT_STATUSES', [])
    }
  },
  
  async fetchNonProjectTypes({ commit }) {
    try {
      const { data } = await ApiService.get('master/non-project-types')
      commit('SET_NON_PROJECT_TYPES', data?.data || [])
    } catch (error) {
      console.error('Failed to fetch non-project types:', error)
      commit('SET_NON_PROJECT_TYPES', [])
    }
  },
  
  async fetchApplications({ commit }) {
    try {
      const { data } = await ApiService.get('master/applications')
      commit('SET_APPLICATIONS', data?.data || [])
    } catch (error) {
      console.error('Failed to fetch applications:', error)
      commit('SET_APPLICATIONS', [])
    }
  },
  
  async fetchHolidays({ commit }) {
    try {
      const { data } = await ApiService.get('master/holidays')
      commit('SET_HOLIDAYS', data?.data || [])
    } catch (error) {
      console.error('Failed to fetch holidays:', error)
      commit('SET_HOLIDAYS', [])
    }
  },
  
  // Project Statuses (CRD with soft delete in DB)
  async addProjectStatus({ commit, dispatch }, name) {
    // Backend auto-fills created_by from JWT, just send name
    const { data } = await ApiService.post('master/project-statuses', { name })
    commit('ADD_PROJECT_STATUS', data?.data)
    // Refresh list to ensure sync with backend
    await dispatch('fetchProjectStatuses')
  },
  async softDeleteProjectStatus({ commit, dispatch }, id) {
    await ApiService.delete(`master/project-statuses/${id}`)
    commit('SOFT_DELETE_PROJECT_STATUS', id)
    // Refresh list to ensure sync with backend
    await dispatch('fetchProjectStatuses')
  },
  
  // Non-Project Types
  async addNonProjectType({ commit, dispatch }, name) {
    // Backend auto-fills created_by from JWT, just send name
    const { data } = await ApiService.post('master/non-project-types', { name })
    commit('ADD_NON_PROJECT_TYPE', data?.data)
    await dispatch('fetchNonProjectTypes')
  },
  async softDeleteNonProjectType({ commit, dispatch }, id) {
    await ApiService.delete(`master/non-project-types/${id}`)
    commit('SOFT_DELETE_NON_PROJECT_TYPE', id)
    await dispatch('fetchNonProjectTypes')
  },
  
  // Applications
  async addApplication({ commit, dispatch }, name) {
    // Backend auto-fills created_by from JWT, just send name
    const { data } = await ApiService.post('master/applications', { name })
    commit('ADD_APPLICATION', data?.data)
    await dispatch('fetchApplications')
  },
  async softDeleteApplication({ commit, dispatch }, id) {
    await ApiService.delete(`master/applications/${id}`)
    commit('SOFT_DELETE_APPLICATION', id)
    await dispatch('fetchApplications')
  },
  
  // Holidays
  async addHoliday({ commit, dispatch }, holiday) {
    // Backend auto-fills created_by from JWT, just send date & description
    const { data } = await ApiService.post('master/holidays', holiday)
    commit('ADD_HOLIDAY', data?.data)
    await dispatch('fetchHolidays')
  },
  async softDeleteHoliday({ commit, dispatch }, id) {
    await ApiService.delete(`master/holidays/${id}`)
    commit('SOFT_DELETE_HOLIDAY', id)
    await dispatch('fetchHolidays')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
