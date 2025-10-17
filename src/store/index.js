import { createStore } from 'vuex'
import auth from '@/store/modules/auth'
import employees from '@/store/modules/employees'
import projects from '@/store/modules/projects'
import nonProjects from '@/store/modules/nonProjects'
import master from '@/store/modules/master'

const store = createStore({
  modules: {
    auth,
    employees,
    projects,
    nonProjects,
    master
  }
})

export default store
