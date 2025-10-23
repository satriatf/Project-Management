import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Home.vue'
import store from '@/store'
import JwtService from '@/common/jwt.service'

// Dashboard
import DashboardView from '../views/Dashboard/Dashboard.vue'

// Employees
import EmployeeList from '../views/Employees/EmployeeList.vue'
import EmployeeCreate from '../views/Employees/EmployeeCreate.vue'
import EmployeeEdit from '../views/Employees/EmployeeEdit.vue'

// Projects
import ProjectList from '../views/Projects/ProjectList.vue'
import ProjectCreate from '../views/Projects/ProjectCreate.vue'
import ProjectEdit from '../views/Projects/ProjectEdit.vue'

// Non-Projects
import NonProjectList from '../views/NonProjects/NonProjectList.vue'
import NonProjectCreate from '../views/NonProjects/NonProjectCreate.vue'
import NonProjectEdit from '../views/NonProjects/NonProjectEdit.vue'

// Timeline
import Timeline from '../views/Timeline/Timeline.vue'

// Master - Non-Project Types
import NonProjectTypeList from '../views/Master/NonProjectType/NonProjectTypeList.vue'
import NonProjectTypeCreate from '../views/Master/NonProjectType/NonProjectTypeCreate.vue'

// Master - Project Statuses
import ProjectStatusList from '../views/Master/ProjectStatus/ProjectStatusList.vue'
import ProjectStatusCreate from '../views/Master/ProjectStatus/ProjectStatusCreate.vue'

// Master - Applications
import ApplicationList from '../views/Master/Application/ApplicationList.vue'
import ApplicationCreate from '../views/Master/Application/ApplicationCreate.vue'

// Master - Holidays
import HolidayList from '../views/Master/Holiday/HolidayList.vue'
import HolidayCreate from '../views/Master/Holiday/HolidayCreate.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: Dashboard,
      redirect: { name: 'dashboard' },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: DashboardView
        },
        // Employees
        {
          path: 'employees',
          name: 'employee-list',
          component: EmployeeList
        },
        {
          path: 'employees/create',
          name: 'employee-create',
          component: EmployeeCreate
        },
        {
          path: 'employees/:id/edit',
          name: 'employee-edit',
          component: EmployeeEdit
        },
        // Projects
        {
          path: 'projects',
          name: 'project-list',
          component: ProjectList
        },
        {
          path: 'projects/create',
          name: 'project-create',
          component: ProjectCreate
        },
        {
          path: 'projects/:id/edit',
          name: 'project-edit',
          component: ProjectEdit
        },
        // Non-Projects
        {
          path: 'non-projects',
          name: 'nonproject-list',
          component: NonProjectList
        },
        {
          path: 'non-projects/create',
          name: 'nonproject-create',
          component: NonProjectCreate
        },
        {
          path: 'non-projects/:id/edit',
          name: 'nonproject-edit',
          component: NonProjectEdit
        },
        // Timeline
        {
          path: 'timeline',
          name: 'timeline',
          component: Timeline
        },
        // Master - Non-Project Types
        {
          path: 'master/non-project-types',
          name: 'nonproject-type-list',
          component: NonProjectTypeList
        },
        {
          path: 'master/non-project-types/create',
          name: 'nonproject-type-create',
          component: NonProjectTypeCreate
        },
        // Master - Project Statuses
        {
          path: 'master/project-statuses',
          name: 'project-status-list',
          component: ProjectStatusList
        },
        {
          path: 'master/project-statuses/create',
          name: 'project-status-create',
          component: ProjectStatusCreate
        },
        // Master - Applications
        {
          path: 'master/applications',
          name: 'application-list',
          component: ApplicationList
        },
        {
          path: 'master/applications/create',
          name: 'application-create',
          component: ApplicationCreate
        },
        // Master - Holidays
        {
          path: 'master/holidays',
          name: 'holiday-list',
          component: HolidayList
        },
        {
          path: 'master/holidays/create',
          name: 'holiday-create',
          component: HolidayCreate
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})

// Add explicit /dashboard path to avoid 'No match for /dashboard'
router.addRoute({ path: '/dashboard', redirect: { name: 'dashboard' } })

// Global navigation guard (minimal logs)
router.beforeEach((to, from, next) => {
  const token = JwtService.getToken()
  const isAuthenticated = !!token

  // Redirect unknown routes to dashboard
  if (to.matched.length === 0) {
    console.warn('Router: Unknown route, redirecting to dashboard')
    return next({ name: 'dashboard' })
  }

  // Prevent accessing login if already authenticated
  if (to.name === 'login' && isAuthenticated) return next({ name: 'dashboard' })

  // Protect app routes when not authenticated
  if (to.name !== 'login' && !isAuthenticated) return next({ name: 'login' })

  next()
})

// Handle potential uncaught navigation promise rejections (e.g., same-route navigations)
const originalPush = router.push
router.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

export default router
