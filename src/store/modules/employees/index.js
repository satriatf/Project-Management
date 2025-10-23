import ApiService from '@/common/api.service'

// Employee Store Module (API-backed)
const state = {
  employees: []
}

const getters = {
  allEmployees: (state) => {
    // Sort by level hierarchy: Manager > Asmen > SH > Staff > Intern
    const levelOrder = { 'Manager': 1, 'Asmen': 2, 'SH': 3, 'Staff': 4, 'Intern': 5 }
    return [...state.employees].sort((a, b) => {
      const orderA = levelOrder[a.level] || 999
      const orderB = levelOrder[b.level] || 999
      return orderA - orderB
    })
  },
  employeeById: (state) => (id) => state.employees.find(emp => emp.sk_user === id),
  employeesByLevel: (state) => (level) => state.employees.filter(emp => emp.level === level && emp.is_active === 'Active'),
  activeEmployees: (state) => {
    const levelOrder = { 'Manager': 1, 'Asmen': 2, 'SH': 3, 'Staff': 4, 'Intern': 5 }
    return state.employees
      .filter(emp => emp.is_active === 'Active')
      .sort((a, b) => {
        const orderA = levelOrder[a.level] || 999
        const orderB = levelOrder[b.level] || 999
        return orderA - orderB
      })
  }
}

const mutations = {
  SET_EMPLOYEES(state, employees) {
    state.employees = employees
  },
  ADD_EMPLOYEE(state, employee) {
    state.employees.push(employee)
  },
  UPDATE_EMPLOYEE(state, updatedEmployee) {
    const index = state.employees.findIndex(emp => emp.sk_user === updatedEmployee.sk_user)
    if (index !== -1) {
      state.employees.splice(index, 1, updatedEmployee)
    }
  },
  DELETE_EMPLOYEE(state, id) {
    // Permanent delete - remove from array
    const index = state.employees.findIndex(emp => emp.sk_user === id)
    if (index !== -1) {
      state.employees.splice(index, 1)
    }
  }
}

const actions = {
  async fetchEmployees({ commit }) {
    const { data } = await ApiService.get('employees')
    const list = Array.isArray(data?.data) ? data.data : []
    // Normalize backend camelCase -> frontend snake_case that UI expects
    const normalized = list.map(u => ({
      sk_user: u.id,
      employee_nik: u.employeeNik,
      employee_email: u.employeeEmail,
      employee_name: u.employeeName,
      level: u.level,
      is_active: u.isActive,
      join_date: u.joinDate,
      end_date: u.endDate
    }))
    commit('SET_EMPLOYEES', normalized)
  },
  async addEmployee({ commit }, employee) {
    // Map UI payload -> backend payload
    const payload = {
      employeeNik: Number(employee.nik),
      employeeName: employee.name,
      employeeEmail: employee.email,
      level: employee.level,
      isActive: employee.isActive === true ? 'Active' : employee.isActive === false ? 'Inactive' : (employee.isActive || 'Active'),
      joinDate: employee.joinDate || null,
      endDate: employee.endDate || null,
      password: employee.password
    }
    const { data } = await ApiService.post('employees', payload)
    const u = data?.data || {}
    commit('ADD_EMPLOYEE', {
      sk_user: u.id,
      employee_nik: u.employeeNik,
      employee_email: u.employeeEmail,
      employee_name: u.employeeName,
      level: u.level,
      is_active: u.isActive,
      join_date: u.joinDate,
      end_date: u.endDate
    })
  },
  async updateEmployee({ commit }, employee) {
    // Get the ID from either id or sk_user
    const employeeId = employee.id ?? employee.sk_user
    
    if (!employeeId) {
      throw new Error('Employee ID is required for update')
    }

    const payload = {
      employeeName: employee.name ?? employee.employee_name,
      employeeEmail: employee.email ?? employee.employee_email,
      level: employee.level,
      isActive: employee.isActive === true ? 'Active' : employee.isActive === false ? 'Inactive' : (employee.is_active || 'Active'),
      joinDate: employee.joinDate ?? employee.join_date ?? null,
      endDate: employee.endDate ?? employee.end_date ?? null
    }
    
    // Only include NIK if it's provided and valid
    const nikValue = employee.nik ?? employee.employee_nik
    if (nikValue !== null && nikValue !== undefined && nikValue !== '') {
      const numericNik = Number(nikValue)
      if (!isNaN(numericNik)) {
        payload.employeeNik = numericNik
      }
    }
    
    // Only include password if it's provided
    if (employee.password && employee.password.trim() !== '') {
      payload.password = employee.password
    }
    
    const { data } = await ApiService.put(`employees/${employeeId}`, payload)
    const u = data?.data || {}
    commit('UPDATE_EMPLOYEE', {
      sk_user: u.id,
      employee_nik: u.employeeNik,
      employee_email: u.employeeEmail,
      employee_name: u.employeeName,
      level: u.level,
      is_active: u.isActive,
      join_date: u.joinDate,
      end_date: u.endDate
    })
  },
  async deleteEmployee({ commit, dispatch }, id) {
    await ApiService.delete(`employees/${id}`)
    commit('DELETE_EMPLOYEE', id)
    // Re-fetch to sync with backend
    await dispatch('fetchEmployees')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
