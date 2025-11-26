<script setup lang="ts"></script>

<template>
  <div class="smoke-container">
    <div class="fog-layer layer-1"></div>
    <div class="fog-layer layer-2"></div>
    <div class="fog-layer layer-3"></div>
  </div>
</template>

<style scoped>
.smoke-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1; /* Above background, below content */
  pointer-events: none;
}

.fog-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 100%;
  background: url("https://raw.githubusercontent.com/danielstuart14/CSS_FOG_ANIMATION/master/img/fog1.png")
    repeat-x;
  background-size: contain;
  opacity: 0.3;
}

.layer-1 {
  animation: fog 60s linear infinite;
  z-index: 1;
}

.layer-2 {
  background: url("https://raw.githubusercontent.com/danielstuart14/CSS_FOG_ANIMATION/master/img/fog2.png")
    repeat-x;
  background-size: contain;
  animation: fog 40s linear infinite;
  z-index: 2;
  opacity: 0.2;
}

.layer-3 {
  background: url("https://raw.githubusercontent.com/danielstuart14/CSS_FOG_ANIMATION/master/img/fog1.png")
    repeat-x;
  background-size: contain;
  animation: fog 80s linear infinite;
  z-index: 3;
  opacity: 0.1;
}

@keyframes fog {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(-50%, 0, 0);
  }
}
</style>
