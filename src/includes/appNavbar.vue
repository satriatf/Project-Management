<template lang="html">
  <nav class="navbar navbar-expand px-4">
    <div class="logo-login">
      <img src="/src/assets/img/log_hitam.png" alt="" srcset="" style="margin: 0 !important; max-width: 100px" />
    </div>

    <div class="breadcum d-sm-inline-block">
      <div class="" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="sidebar-item px-2 dropdown" v-for="(menuItem, index) in menus" :key="index">
            <a v-if="!menuItem.subMenu" @click="handleClick(menuItem.parentMenu, menuItem.parentMenu, index)"
              :class="{ 'navbar-link': true, 'activeMenu': isActiveMenu(index) }" style="cursor: pointer;"
              aria-expanded="true">
              <Strong>
                <span>{{ MenuPrety(menuItem.parentMenu) }}</span>
              </Strong>
            </a>
            <!-- Menu with Submenu -->
            <a v-else class="navbar-link dropdown-toggle" href="#" id="a" role="button" data-bs-toggle="dropdown"
              :data-bs-target="'#' + menuItem.parentMenu" aria-expanded="false"
              :class="{ 'navbar-link': true, 'activeMenu': isActiveMenu(index) }">
              <Strong>
                <span>{{ MenuPrety(menuItem.parentMenu) }}</span>
              </Strong>
            </a>
            <ul :id="menuItem.parentMenu" class="dropdown-menu navbar-menu" aria-labelledby="navbarDropdown">
              <li v-for="(subMenu, subIndex) in menuItem.subMenu" :key="subIndex" style="padding:5px 0px;"> <a
                  @click="SubhandleClick(subMenu.name, index)" href="#" class="subNavbar-link"
                  :class="{ 'activeMenu': isSubActiveMenu(subMenu.name) }">{{
                    MenuPrety(subMenu.name) }}</a></li>

            </ul>
            <!-- Submenu Dropdown -->
            <!-- <ul :id="menuItem.parentMenu" class="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar"
              style=" padding-left:revert;">
              <li class="sidebar-item" v-for="(subMenu, subIndex) in menuItem.subMenu" :key="subIndex">
                <Strong>
                  <a @click="SubhandleClick(subMenu.name, index)" href="#" class="sidebar-link"
                    :class="{ 'activeMenu': isSubActiveMenu(subMenu.name) }">{{
                      MenuPrety(subMenu.name) }}</a>
                </Strong>
              </li>

            </ul> -->
          </li>

        </ul>
      </div>
    </div>


    <div class="navbar-collapse collapse">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item dropdown d-flex">
          <div class="" v-if="role == 'IDM.Asset_Staff'">
          </div>
          <div class="notification px-2 dropdown-toggle" v-else data-bs-toggle="dropdown" aria-expanded="false"
            style="cursor: pointer;">
            <i class="bi bi-bell" />
            <span class="text-center">{{ unreadCount }}</span>
            <ul class="dropdown-menu dropdown-menu-lg-end menu-notif">
              <li>
                <h6 class="dropdown-header">Notifications</h6>
              </li>
              <div class="body notif" v-if="NotifMessage.length > 0">
                <div v-for="notif in NotifMessage" :key="notif.id">
                  <li>
                    <div class="d-flex px-2 align-items-center justify-content-around py-3 body-notif"
                      :class="notif.status === '1' ? 'read' : 'not-read'">
                      <div class="initial-pengirim" :class="notif.status === '1' ? 'read' : 'not-read'">
                        <i class="fa-solid fa-bell fa-2xs bell"></i>
                      </div>
                      <div class="notif-message px-3">
                        <a class="text-black" @click="readNotif(notif.id)">
                          {{ formatCreateDate(notif.createDate) }}
                        </a>
                        <a class="text-black" @click="readNotif(notif.id)">
                          {{ notif.pesan }}
                        </a>
                      </div>
                    </div>
                  </li>
                </div>
              </div>

              <div class="" v-else>
                <li>
                  <div class="d-flex px-2 align-items-center justify-content-around py-3 border-bottom">
                    <div class="notif-message px-3">
                      <div class="img-not-found text-center ">
                        <img src="../assets/img/NotFound.png" alt="" class="py-1">

                      </div>
                    </div>
                  </div>
                </li>
              </div>
              <div class="footer-notif d-flex justify-content-center align-item-center py-3"
                v-if="role !== 'IDM.Asset_Staff'">
                <li>
                  <button class="d-flex align-items-center btn-sm btn" @click="setActivePage('inbox')">
                    View All <i class="fa fa-arrow-right fa-sm px-1"></i>
                  </button>
                </li>
              </div>

            </ul>
          </div>
          <a class="logout">
            <span class="text-black px-3" style="font-size: 12px;">
              {{ name }} ({{ nik }})
            </span>
            <a @click="logout" style="cursor: pointer;">
              <i class="bi bi-box-arrow-right"></i>
            </a>

          </a>
        </li>
      </ul>
    </div>


  </nav>
</template>

<script>
import { CALL_SERVICE_ASYNC_GET, CALL_SERVICE_ASYNC_SUBMIT, LOGOUT } from '@/store/actions.type';
import { formatDistanceToNowStrict, parseISO } from 'date-fns'
import JwtService from '@/common/jwt.service.js'
import alertService from '@/common/alertService.js'
import userService from '@/common/user.service.js'
export default {
  data() {
    return {
      NotifMessage: [],
      activeIndex: this.index,
      SubactiveIndex: ''
    };
  },
  computed: {
    // User info (decrypted)
    name() {
      return userService.getNama() || 'User'
    },
    nik() {
      return userService.getNik() || ''
    },
    role() {
      const role = userService.getRole()
      if (Array.isArray(role)) return role.join(', ')
      return role || ''
    },
    isAuthenticated() {
      return this.$store.state.auth?.isAuthenticated || !!sessionStorage.getItem('token')
    },
    // Notifications
    unreadCount() {
      return this.NotifMessage.filter(notif => notif.status === '0').length;
    }
  },
  props: {
    breadcrumbs: {
      type: String,
      // default: 'Dashboard'
    },
    title: {
      type: String,
      default: 'IT Adira Finance'
    },
    menus: {
      type: Array,
      default: () => []
    },
    index: {
      type: Number,
      default: '0'
    }
  },
  watch: {
    'index'() {
      this.handleClick('Inbox', 'Inbox', 1);

    },
    index(newIndex) {
      console.log(newIndex)
      this.activeIndex = newIndex;
    }
  },
  methods: {
    async logout() {
      const confirmed = await alertService.confirm({
        message: 'Apakah Anda Yakin Ingin Keluar?',
        confirmText: 'Keluar',
        cancelText: 'Batal',
        image: 'warning'
      });

      if(confirmed){
        // Simple logout - clear all session data
        sessionStorage.clear()
        JwtService.destroyToken()
        
        // Navigate to login
        this.$router.push({ name: 'login' }).then(() => {
          window.location.reload()
        })
      }
    },
    notification() {
      this.$store.dispatch(CALL_SERVICE_ASYNC_GET, {
        token: localStorage.getItem('token'),
        url: import.meta.env.VITE_NOTIF_FIND + this.nik
      }).then(Response => {
        this.NotifMessage = Response.data.sort((a, b) => {
          return new Date(b.createDate) - new Date(a.createDate);
        });
      })
    },
    readNotif(id) {
      this.$store.dispatch(CALL_SERVICE_ASYNC_SUBMIT, {
        body: {
          id: id
        },
        url: import.meta.env.VITE_NOTIF_READ
      }).then(Response => {
        this.notification();
        console.log(Response);
      })
    },
    formatCreateDate(dateString) {
      if (typeof dateString !== 'string') {
        console.error('Invalid date string:', dateString);
        return 'Invalid date';
      }

      const date = parseISO(dateString);
      return formatDistanceToNowStrict(date, { addSuffix: true });
    },
    MenuPrety(name) {
      return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    },
    handleClick(page, name, index) {
      this.$emit('set-page', page);
      this.$emit('set-name', name);
      this.$emit('set-index', index);

    },
    isActiveMenu(index) {
      return index === this.activeIndex;
    },
    SubhandleClick(subPage, index) {
      console.log(index);
      this.$emit('set-page', subPage);
      this.SubactiveIndex = subPage
      this.$emit('set-index', index);
      this.$emit('set-name', subPage);
    },
    isSubActiveMenu(subPage) {
      return subPage === this.SubactiveIndex;
    },
  },
  mounted() {
    this.notification();
  }
}
</script>
<style scoped>
.notification {
  position: relative;
  display: inline-block;
}

.notification .fa-bell {
  font-size: 24px;
}

.notification span {
  position: absolute;
  top: -4px;
  left: 0px;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 2px 4px;
  font-size: 8px;
  font-weight: bold;

}

.notification .fa-bell {
  font-size: 16px !important;
}

.dropdown-toggle::after {
  display: none !important;
}

.body.notif {
  max-height: 300px;
  /* Sesuaikan tinggi maksimum sesuai kebutuhan Anda */
  overflow-y: auto;
}
</style>
