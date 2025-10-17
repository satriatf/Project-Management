// Employee Store Module
const state = {
  employees: [
    {
      id: 1,
      nik: '12233344',
      name: 'Zestado Mahesa Yudha',
      email: 'zestado.yudha@adira.co.id',
      level: 'Manager',
      isActive: true,
      joinDate: '2025-09-30',
      endDate: null
    },
    {
      id: 2,
      nik: '111111',
      name: 'Ammar Sayuti',
      email: 'ammar.sayuti@adira.co.id',
      level: 'Asmen',
      isActive: true,
      joinDate: '2024-01-15',
      endDate: null
    },
    {
      id: 3,
      nik: '2222222',
      name: 'Bimo Saputra',
      email: 'bimo@adira.co.id',
      level: 'SH',
      isActive: true,
      joinDate: '2024-03-20',
      endDate: null
    },
    {
      id: 4,
      nik: '333333',
      name: 'Satria Tri Ferdiansyah',
      email: 'v.satria.ferdiansyah@adira.co.id',
      level: 'Staff',
      isActive: true,
      joinDate: '2024-06-01',
      endDate: null
    },
    {
      id: 5,
      nik: '444444',
      name: 'Andi Pratama',
      email: 'andi.pratama@adira.co.id',
      level: 'Intern',
      isActive: true,
      joinDate: '2024-07-01',
      endDate: '2024-12-31'
    },
    {
      id: 6,
      nik: '555555',
      name: 'Dewi Sartika',
      email: 'dewi.sartika@adira.co.id',
      level: 'Staff',
      isActive: false,
      joinDate: '2023-01-10',
      endDate: '2024-09-30'
    }
  ]
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
  }
}

const actions = {
  fetchEmployees({ commit }) {
    // API call would go here
    // For now using mock data
  },
  addEmployee({ commit }, employee) {
    commit('ADD_EMPLOYEE', employee)
  },
  updateEmployee({ commit }, employee) {
    commit('UPDATE_EMPLOYEE', employee)
  },
  deleteEmployee({ commit }, id) {
    commit('DELETE_EMPLOYEE', id)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
