<script setup>
import { RouterView } from 'vue-router';
import { ref, inject, onMounted } from 'vue'

const loadingRef = ref(null)
const globalLoadingRef = inject('loadingRef')

onMounted(() => {
  if (globalLoadingRef) {
    globalLoadingRef.value = loadingRef.value
  }
})
</script>

<template>
  <GlobalLoading ref="loadingRef" />
  <router-view />
</template>


<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Material+Icons');
@import '@/assets/css/style.css';
@import '@/assets/css/datatable.css';
@import '@/assets/css/unified-table.css';
</style>
