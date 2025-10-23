import ApiService from '@/common/api.service'
import userService from '@/common/user.service'

// Non-Projects Store Module (API-backed)
const state = {
  nonProjects: []
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
  async fetchNonProjects({ commit }) {
    const { data } = await ApiService.get('non-projects')
    const list = Array.isArray(data?.data) ? data.data : []
    const normalized = list.map(n => ({
      id: n.id,
      createdBy: n.createdById,
      ticketNo: n.noTiket,
      description: n.deskripsi,
      type: n.type,
      resolverPic: n.resolverId,
      solution: n.solusi,
      application: n.application,
      date: n.tanggal,
      attachment: n.attachmentsJson ? JSON.parse(n.attachmentsJson) : null,
      isDelete: n.isDelete
    }))
    commit('SET_NON_PROJECTS', normalized)
  },
  async addNonProject({ commit }, nonProject) {
    // Backend expects exact field names
    const payload = {
      createdById: nonProject.createdById || userService.getId(),
      resolverId: nonProject.resolverId,  // Already a number ID
      noTiket: nonProject.noTiket,
      deskripsi: nonProject.deskripsi,
      type: nonProject.type,
      solusi: nonProject.solusi || '',
      application: nonProject.application,
      tanggal: nonProject.tanggal,
      attachmentsJson: nonProject.attachmentsJson || null,
      attachmentsCount: nonProject.attachmentsCount || 0
    }
    const { data } = await ApiService.post('non-projects', payload)
    const n = data?.data || {}
    commit('ADD_NON_PROJECT', {
      id: n.id,
      createdBy: n.createdById,
      ticketNo: n.noTiket,
      description: n.deskripsi,
      type: n.type,
      resolverPic: n.resolverId,
      solution: n.solusi,
      application: n.application,
      date: n.tanggal,
      attachment: n.attachmentsJson ? JSON.parse(n.attachmentsJson) : null,
      isDelete: n.isDelete
    })
  },
  async updateNonProject({ commit, dispatch }, nonProject) {
    const payload = {
      createdById: nonProject.createdById || nonProject.createdBy,
      resolverId: nonProject.resolverPic,
      resolverPicsJson: nonProject.resolverPicsJson || (Array.isArray(nonProject.resolverPics) ? JSON.stringify(nonProject.resolverPics) : undefined),
      tlId: nonProject.tlId || null,
      noTiket: nonProject.ticketNo,
      deskripsi: nonProject.description,
      type: nonProject.type,
      solusi: nonProject.solution || '',
      application: nonProject.application,
      tanggal: nonProject.date,
      attachmentsJson: nonProject.attachment ? JSON.stringify(nonProject.attachment) : null,
      attachmentsCount: nonProject.attachment ? 1 : 0
    }
    const { data } = await ApiService.put(`non-projects/${nonProject.id}`, payload)
    const n = data?.data || {}
    commit('UPDATE_NON_PROJECT', {
      id: n.id,
      createdBy: n.createdById,
      ticketNo: n.noTiket,
      description: n.deskripsi,
      type: n.type,
      resolverPic: n.resolverId,
      solution: n.solusi,
      application: n.application,
      date: n.tanggal,
      attachment: n.attachmentsJson ? JSON.parse(n.attachmentsJson) : null,
      isDelete: n.isDelete
    })
    // Re-fetch to sync with backend
    await dispatch('fetchNonProjects')
  },
  async deleteNonProject({ commit, dispatch }, id) {
    await ApiService.delete(`non-projects/${id}`)
    commit('DELETE_NON_PROJECT', id)
    // Re-fetch to sync with backend
    await dispatch('fetchNonProjects')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
