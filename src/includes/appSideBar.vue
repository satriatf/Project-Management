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

            <!-- Employees -->
            <li class="sidebar-item">
                <router-link to="/employees" class="sidebar-link" :class="{ 'activeMenu': $route.path.includes('/employees') }">
                    <i class="fa fa-users"></i>
                    <span>Employees</span>
                </router-link>
            </li>

            <!-- Project Timeline -->
            <li class="sidebar-item">
                <router-link to="/timeline" class="sidebar-link" :class="{ 'activeMenu': $route.name === 'timeline' }">
                    <i class="fa fa-clock-o"></i>
                    <span>Project Timeline</span>
                </router-link>
            </li>

            <!-- Tasks -->
            <li class="sidebar-item">
                <a href="#tasks" class="sidebar-link collapsed has-dropdown" data-bs-toggle="collapse" 
                   data-bs-target="#tasks" aria-expanded="false">
                    <i class="fa fa-tasks"></i>
                    <span>Tasks</span>
                </a>
                <ul id="tasks" class="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar" style="padding-left:revert;">
                    <li class="sidebar-item">
                        <router-link to="/projects" class="sidebar-link" :class="{ 'activeMenu': $route.path.includes('/projects') }">
                            Projects
                        </router-link>
                    </li>
                    <li class="sidebar-item">
                        <router-link to="/non-projects" class="sidebar-link" :class="{ 'activeMenu': $route.path.includes('/non-projects') }">
                            Non-Projects
                        </router-link>
                    </li>
                </ul>
            </li>

            <!-- Master -->
            <li class="sidebar-item">
                <a href="#master" class="sidebar-link collapsed has-dropdown" data-bs-toggle="collapse" 
                   data-bs-target="#master" aria-expanded="false">
                    <i class="fa fa-database"></i>
                    <span>Master</span>
                </a>
                <ul id="master" class="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar" style="padding-left:revert;">
                    <li class="sidebar-item">
                        <router-link to="/master/project-statuses" class="sidebar-link" :class="{ 'activeMenu': $route.path.includes('/master/project-statuses') }">
                            Project Statuses
                        </router-link>
                    </li>
                    <li class="sidebar-item">
                        <router-link to="/master/non-project-types" class="sidebar-link" :class="{ 'activeMenu': $route.path.includes('/master/non-project-types') }">
                            Non-Project Types
                        </router-link>
                    </li>
                    <li class="sidebar-item">
                        <router-link to="/master/applications" class="sidebar-link" :class="{ 'activeMenu': $route.path.includes('/master/applications') }">
                            Applications
                        </router-link>
                    </li>
                    <li class="sidebar-item">
                        <router-link to="/master/holidays" class="sidebar-link" :class="{ 'activeMenu': $route.path.includes('/master/holidays') }">
                            Holidays
                        </router-link>
                    </li>
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
