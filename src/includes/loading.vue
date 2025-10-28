<template>
  <div
    v-if="visible"
    class="loading-overlay"
  >
    <div class="loading-dots">
      <span />
      <span />
      <span />
    </div>
  </div>
</template>

<script>
import '@/assets/css/includes/includes.css'

// istanbul ignore file
export default {
  name: 'GlobalLoading',
  data() {
    return {
      visible: false
    };
  },
  methods: {
    show() {
      this.visible = true;
    },
    hide() {
      this.visible = false;
    }
  }
};
</script>

