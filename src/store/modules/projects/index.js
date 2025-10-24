import ApiService from '@/common/api.service'

// Projects Store Module (API-backed)
const state = {
  projects: []
}

const getters = {
  allProjects: (state) => state.projects,
  projectById: (state) => (id) => {
    // Handle both UUID string and direct match
    return state.projects.find(proj => proj.sk_project === id || String(proj.sk_project) === String(id))
  }
}

const mutations = {
  SET_PROJECTS(state, projects) {
    state.projects = projects
  },
  ADD_PROJECT(state, project) {
    state.projects.push(project)
  },
  UPDATE_PROJECT(state, updatedProject) {
    const index = state.projects.findIndex(proj => proj.sk_project === updatedProject.sk_project)
    if (index !== -1) {
      state.projects.splice(index, 1, updatedProject)
    }
  },
  DELETE_PROJECT(state, id) {
    state.projects = state.projects.filter(proj => proj.sk_project !== id)
  }
}

const actions = {
  async fetchProjects({ commit }) {
    const { data } = await ApiService.get('projects')
    const list = Array.isArray(data?.data) ? data.data : []
    const normalized = list.map(p => ({
      sk_project: p.id,
      project_ticket_no: p.projectTicketNo,
      project_name: p.projectName,
      project_status: p.projectStatus,
      technical_lead: p.technicalLead,
      pics_json: p.picsJson,
      start_date: p.startDate,
      end_date: p.endDate,
      total_day: p.totalDay,
      percent_done: p.percentDone,
      is_delete: p.isDelete
    }))
    commit('SET_PROJECTS', normalized)
  },
  async addProject({ commit }, project) {
    const payload = {
      projectTicketNo: project.project_ticket_no,
      projectName: project.project_name,
      projectStatus: project.project_status,
      technicalLead: project.technical_lead,
      picsJson: project.pics_json,
      startDate: project.start_date,
      endDate: project.end_date,
      totalDay: Number(project.total_day) || 0,
      percentDone: Number(project.percent_done) || 0
    }
    const { data } = await ApiService.post('projects', payload)
    const p = data?.data || {}
    commit('ADD_PROJECT', {
      sk_project: p.id,
      project_ticket_no: p.projectTicketNo,
      project_name: p.projectName,
      project_status: p.projectStatus,
      technical_lead: p.technicalLead,
      pics_json: p.picsJson,
      start_date: p.startDate,
      end_date: p.endDate,
      total_day: p.totalDay,
      percent_done: p.percentDone,
      is_delete: p.isDelete
    })
  },
  async updateProject({ commit, dispatch }, project) {
    const payload = {
      projectTicketNo: project.project_ticket_no,
      projectName: project.project_name,
      projectStatus: project.project_status,
      technicalLead: project.technical_lead,
      picsJson: project.pics_json,
      startDate: project.start_date,
      endDate: project.end_date,
      totalDay: Number(project.total_day),
      percentDone: Number(project.percent_done)
    }
    const { data } = await ApiService.put(`projects/${project.sk_project}`, payload)
    const p = data?.data || {}
    commit('UPDATE_PROJECT', {
      sk_project: p.id,
      project_ticket_no: p.projectTicketNo,
      project_name: p.projectName,
      project_status: p.projectStatus,
      technical_lead: p.technicalLead,
      pics_json: p.picsJson,
      start_date: p.startDate,
      end_date: p.endDate,
      total_day: p.totalDay,
      percent_done: p.percentDone,
      is_delete: p.isDelete
    })
    // Re-fetch to sync with backend
    await dispatch('fetchProjects')
  },
  async deleteProject({ commit, dispatch }, id) {
    await ApiService.delete(`projects/${id}`)
    commit('DELETE_PROJECT', id)
    // Re-fetch to sync with backend
    await dispatch('fetchProjects')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
