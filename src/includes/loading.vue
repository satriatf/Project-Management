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

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-dots {
  display: flex;
  gap: 10px;
}

.loading-dots span {
  width: 12px;
  height: 12px;
  background-color: #fddb00;
  border-radius: 50%;
  animation: bounce 0.6s infinite ease-in-out;
}

.loading-dots span:nth-child(1) {
  animation-delay: 0s;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
