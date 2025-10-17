<template lang="html">
  <div class="wrapper">
    <appSideBar />
    <div class="main expand" id="main">
      <appNavbar />
      <main class="content px-2">
        <router-view></router-view>
      </main>
    </div>
  </div>
  <appFooter />
</template>

<script lang="js">
import appFooter from '@/includes/appFooter.vue'
import appSideBar from '@/includes/appSideBar.vue'
import appNavbar from '@/includes/appNavbar-new.vue'

export default {
  name: 'home',
  components: {
    appFooter,
    appSideBar,
    appNavbar
  }
}
</script>
