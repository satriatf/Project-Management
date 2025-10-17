// Master Data Store Module
const state = {
  projectStatuses: [
    { id: 1, name: 'PEMBAHASAN', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 2, name: 'TASKLIST', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 3, name: 'SIGN-OFF', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 4, name: 'NEED SCHEDULE', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 5, name: 'WTD', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 6, name: 'DEV', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 7, name: 'WTQ', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 8, name: 'QC', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 9, name: 'WAITING TO UAT', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 10, name: 'UAT', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 11, name: 'UAT DONE', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 12, name: 'READY TO DEPLOY', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 13, name: 'GO LIVE', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 14, name: 'PENDING PEMBAHASAN', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 15, name: 'PENDING UAT', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 16, name: 'NO IMPACT DEV', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 17, name: 'DROP', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 18, name: 'PENDING DEV', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 19, name: 'PENTEST', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false }
  ],
  nonProjectTypes: [
    { id: 1, name: 'PROBLEM', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 2, name: 'REQUEST DATA', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 3, name: 'INCIDENT', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 4, name: 'SERVICE REQUEST', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 5, name: 'SUPPORT UAT', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 6, name: 'PENTEST', createdBy: 'Zestado Mahesa Yudha', createdDate: '2025-10-15', isDeleted: false }
  ],
  applications: [
    { id: 1, name: 'Ad1Access', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 2, name: 'Public Access', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 3, name: 'Secure Access', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 4, name: 'Ad1Suite', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 5, name: 'Ad1DIS', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 6, name: 'Ad1ForFlow', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 7, name: 'Service Desk', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 8, name: 'Ivanti Service Desk', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 9, name: 'Smile Apps', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 10, name: 'E-Recruitment', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 11, name: 'QPC', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 12, name: 'Ad1Falcon', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 13, name: 'ECM', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 14, name: 'DigiLearn', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 15, name: 'DigiLearn Keday', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 16, name: 'Final Riplay', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 17, name: 'Ihtisar Asuransi', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 18, name: 'BPKBLib', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 19, name: 'CMS Scan BPKB', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 20, name: 'Ad1Primajaga', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 21, name: 'Fiducia Console Konven (Non-DLB)', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 22, name: 'Fiducia Console DLB', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 23, name: 'E-Materai Doc Generator', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 24, name: 'ORMS', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 25, name: 'Adirabox', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 26, name: 'Ad1Internship', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 27, name: 'Asset Management', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 28, name: 'Audit Management', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 29, name: 'Reengineering Ad1Forflow', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 30, name: 'WA Message Generator', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 31, name: 'E-Procurement', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 32, name: 'E-PPT', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 33, name: 'E-PPT PSIAP', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 34, name: 'Ad1sys HQ', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 35, name: 'Ad1Taft', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 36, name: 'Quantum', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 37, name: 'Quantum Helper', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 38, name: 'New JF', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false },
    { id: 39, name: 'SAP ASSIST', createdBy: 'Admin', createdDate: '2025-01-01', isDeleted: false }
  ],
  holidays: [
    { id: 1, name: 'New Year 2025', date: '2025-01-01', createdBy: 'Admin', createdDate: '2024-12-01', isDeleted: false },
    { id: 2, name: 'Eid al-Fitr', date: '2025-03-30', createdBy: 'Admin', createdDate: '2024-12-01', isDeleted: false }
  ]
}

const getters = {
  activeProjectStatuses: (state) => state.projectStatuses.filter(ps => !ps.isDeleted),
  activeNonProjectTypes: (state) => state.nonProjectTypes.filter(npt => !npt.isDeleted),
  activeApplications: (state) => state.applications.filter(app => !app.isDeleted),
  activeHolidays: (state) => state.holidays.filter(h => !h.isDeleted)
}

const mutations = {
  // Project Statuses
  ADD_PROJECT_STATUS(state, status) {
    state.projectStatuses.push(status)
  },
  SOFT_DELETE_PROJECT_STATUS(state, id) {
    const status = state.projectStatuses.find(ps => ps.id === id)
    if (status) status.isDeleted = true
  },
  
  // Non-Project Types
  ADD_NON_PROJECT_TYPE(state, type) {
    state.nonProjectTypes.push(type)
  },
  SOFT_DELETE_NON_PROJECT_TYPE(state, id) {
    const type = state.nonProjectTypes.find(npt => npt.id === id)
    if (type) type.isDeleted = true
  },
  
  // Applications
  ADD_APPLICATION(state, app) {
    state.applications.push(app)
  },
  SOFT_DELETE_APPLICATION(state, id) {
    const app = state.applications.find(a => a.id === id)
    if (app) app.isDeleted = true
  },
  
  // Holidays
  ADD_HOLIDAY(state, holiday) {
    state.holidays.push(holiday)
  },
  SOFT_DELETE_HOLIDAY(state, id) {
    const holiday = state.holidays.find(h => h.id === id)
    if (holiday) holiday.isDeleted = true
  }
}

const actions = {
  // Project Statuses
  addProjectStatus({ commit }, status) {
    commit('ADD_PROJECT_STATUS', status)
  },
  softDeleteProjectStatus({ commit }, id) {
    commit('SOFT_DELETE_PROJECT_STATUS', id)
  },
  
  // Non-Project Types
  addNonProjectType({ commit }, type) {
    commit('ADD_NON_PROJECT_TYPE', type)
  },
  softDeleteNonProjectType({ commit }, id) {
    commit('SOFT_DELETE_NON_PROJECT_TYPE', id)
  },
  
  // Applications
  addApplication({ commit }, app) {
    commit('ADD_APPLICATION', app)
  },
  softDeleteApplication({ commit }, id) {
    commit('SOFT_DELETE_APPLICATION', id)
  },
  
  // Holidays
  addHoliday({ commit }, holiday) {
    commit('ADD_HOLIDAY', holiday)
  },
  softDeleteHoliday({ commit }, id) {
    commit('SOFT_DELETE_HOLIDAY', id)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
