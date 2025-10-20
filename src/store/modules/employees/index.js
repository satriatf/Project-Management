// Employee Store Module
import ApiService from '@/common/api.service'
import { CALL_SERVICE_ASYNC_GET, CALL_SERVICE_ASYNC_SUBMIT, CALL_SERVICE_ASYNC_UPDATE, CALL_SERVICE_ASYNC_DELETE } from '@/store/actions.type'

const state = {
  employees: [],
  loading: false,
  error: null
}

const getters = {
  allEmployees: (state) => state.employees,
  employeeById: (state) => (id) => state.employees.find(emp => emp.id === id),
  employeesByLevel: (state) => (level) => state.employees.filter(emp => emp.level === level && emp.isActive === true),
  activeEmployees: (state) => state.employees.filter(emp => emp.isActive === true)
}

const mutations = {
  SET_EMPLOYEES(state, employees) {
    state.employees = employees
  },
  ADD_EMPLOYEE(state, employee) {
    state.employees.push(employee)
  },
  UPDATE_EMPLOYEE(state, updatedEmployee) {
    const index = state.employees.findIndex(emp => emp.id === updatedEmployee.id)
    if (index !== -1) {
      state.employees.splice(index, 1, updatedEmployee)
    }
  },
  DELETE_EMPLOYEE(state, id) {
    state.employees = state.employees.filter(emp => emp.id !== id)
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

const actions = {
  async fetchEmployees({ commit }) {
    commit('SET_LOADING', true)
    try {
      const response = await ApiService.get('/employees')
      commit('SET_EMPLOYEES', response.data)
      commit('SET_ERROR', null)
    } catch (error) {
      commit('SET_ERROR', error.message)
      console.error('Error fetching employees:', error)
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async addEmployee({ commit }, employee) {
    commit('SET_LOADING', true)
    try {
      const response = await ApiService.post('/employees', employee)
      commit('ADD_EMPLOYEE', response.data)
      commit('SET_ERROR', null)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async updateEmployee({ commit }, employee) {
    commit('SET_LOADING', true)
    try {
      const response = await ApiService.put(`/employees/${employee.id}`, employee)
      commit('UPDATE_EMPLOYEE', response.data)
      commit('SET_ERROR', null)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  async deleteEmployee({ commit }, id) {
    commit('SET_LOADING', true)
    try {
      await ApiService.delete(`/employees/${id}`)
      commit('DELETE_EMPLOYEE', id)
      commit('SET_ERROR', null)
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
