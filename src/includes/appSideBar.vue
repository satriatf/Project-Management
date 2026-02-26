<template>
    <aside id="sidebar" class="expand">
        <div class="d-flex justify-content-center p-3">
            <button class="toggle-btn" type="button">
                <img src="../assets/img/lOGO.png" alt="Adira Logo" srcset="" class="logo_adira">
            </button>
        </div>
        

        <ul class="sidebar-nav">
            <!-- Dashboard -->
            <li class="sidebar-item">
                <router-link to="/" class="sidebar-link" :class="{ 'activeMenu': $route.name === 'dashboard' }">
                    <i class="fa fa-home"></i>
                    <span>Dashboard</span>
                </router-link>
            </li>

            <!-- Tasks Dropdown -->
            <li class="sidebar-item">
                <a href="#tasks" class="sidebar-link collapsed has-dropdown d-flex align-items-center" data-bs-toggle="collapse" 
                   data-bs-target="#tasks" aria-expanded="false">
                    <i class="fa fa-tasks"></i>
                    <span>Tasks</span>
                </a>
                <ul id="tasks" class="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar" style="padding-left:1.5rem;">
                    <li class="sidebar-item">
                        <router-link to="/projects" class="sidebar-link d-flex justify-content-between align-items-center" :class="{ 'activeMenu': $route.path.includes('/projects') }">
                            <span>Projects</span>
                            <span class="badge bg-warning text-dark rounded-pill small px-2">19</span>
                        </router-link>
                    </li>
                    <li class="sidebar-item">
                        <router-link to="/non-projects" class="sidebar-link d-flex justify-content-between align-items-center" :class="{ 'activeMenu': $route.path.includes('/non-projects') }">
                            <span>Non-Projects</span>
                            <span class="badge bg-warning text-dark rounded-pill small px-2">19</span>
                        </router-link>
                    </li>
                    <li class="sidebar-item">
                        <router-link to="/on-leaves" class="sidebar-link d-flex justify-content-between align-items-center" :class="{ 'activeMenu': $route.path === '/on-leaves' }">
                            <span>On Leaves</span>
                            <span class="badge bg-warning text-dark rounded-pill small px-2">1</span>
                        </router-link>
                    </li>
                </ul>
            </li>

            <!-- Calendar Dropdown -->
            <li class="sidebar-item">
                <a href="#calendar" class="sidebar-link collapsed has-dropdown" data-bs-toggle="collapse" 
                   data-bs-target="#calendar" aria-expanded="false">
                    <i class="fa fa-calendar"></i>
                    <span>Calendar</span>
                </a>
                <ul id="calendar" class="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar" style="padding-left:1.5rem;">
                    <li class="sidebar-item">
                        <router-link to="/calendar/monthly" class="sidebar-link" :class="{ 'activeMenu': $route.path === '/calendar/monthly' }">
                            Monthly
                        </router-link>
                    </li>
                    <li class="sidebar-item">
                        <router-link to="/calendar/yearly" class="sidebar-link" :class="{ 'activeMenu': $route.path === '/calendar/yearly' }">
                            Yearly
                        </router-link>
                    </li>
                    <li class="sidebar-item">
                        <router-link to="/timeline" class="sidebar-link" :class="{ 'activeMenu': $route.name === 'timeline' }">
                            Project Timeline
                        </router-link>
                    </li>
                </ul>
            </li>

            <!-- Report Dropdown -->
            <li class="sidebar-item">
                <a href="#report" class="sidebar-link collapsed has-dropdown" data-bs-toggle="collapse" 
                   data-bs-target="#report" aria-expanded="false">
                    <i class="fa fa-file-text"></i>
                    <span>Report</span>
                </a>
                <ul id="report" class="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar" style="padding-left:1.5rem;">
                    <!-- Placeholder for reports -->
                </ul>
            </li>

            <!-- Master (Keep for admin purposes even if not shown in mockup) -->
            <li class="sidebar-item">
                <a href="#master" class="sidebar-link collapsed has-dropdown" data-bs-toggle="collapse" 
                   data-bs-target="#master" aria-expanded="false">
                    <i class="fa fa-database"></i>
                    <span>Master</span>
                </a>
                <ul id="master" class="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar" style="padding-left:1.5rem;">
                    <li class="sidebar-item">
                        <router-link to="/employees" class="sidebar-link" :class="{ 'activeMenu': $route.path.includes('/employees') }">
                            Employees
                        </router-link>
                    </li>
                    <li class="sidebar-item"><router-link to="/master/project-statuses" class="sidebar-link">Project Statuses</router-link></li>
                    <li class="sidebar-item"><router-link to="/master/non-project-types" class="sidebar-link">Non-Project Types</router-link></li>
                    <li class="sidebar-item"><router-link to="/master/applications" class="sidebar-link">Applications</router-link></li>
                    <li class="sidebar-item"><router-link to="/master/holidays" class="sidebar-link">Holidays</router-link></li>
                </ul>
            </li>
        </ul>
        <div class="sidebar-footer">
            <a @click="logout" class="sidebar-link" style="cursor: pointer;">
                <i class="fa-solid fa-arrow-right-from-bracket"></i>
                <span>Logout</span>
            </a>
        </div>
    </aside>
</template>

<script>
export default {
    name: 'AppSidebar',
    methods: {
        logout() {
            this.$swal({
                text: "Do you want to logout?",
                icon: 'info',
                width: '300px',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Logout!',
            }).then((result) => {
                if (result && result.isConfirmed) {
                    // Clear session and tokens
                    sessionStorage.clear()
                    // Navigate to login and force reload
                    this.$router.push({ name: 'login' }).then(() => {
                        window.location.reload()
                    })
                }
            }).catch((error) => {
                console.error('Logout error:', error)
            })
        }
    }
}
</script>

<style scoped>

</style>
