<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useBandStore } from "../stores/bandStore";

const store = useBandStore();
const currentIndex = ref(0);
let interval: number | null = null;

const startRotation = () => {
  if (store.config.bannerImages.length > 1) {
    interval = setInterval(() => {
      currentIndex.value =
        (currentIndex.value + 1) % store.config.bannerImages.length;
    }, 3000);
  }
};

const goToSlide = (index: number) => {
  currentIndex.value = index;
  // Reset interval to avoid immediate jump after manual selection
  if (interval) clearInterval(interval);
  startRotation();
};

onMounted(() => {
  startRotation();
});

onUnmounted(() => {
  if (interval) clearInterval(interval);
});
</script>

<template>
  <section id="home" class="hero">
    <div class="banner-container" v-if="store.config.bannerImages.length > 0">
      <transition-group name="fade">
        <div
          v-for="(img, index) in store.config.bannerImages"
          :key="img"
          v-show="index === currentIndex"
          class="banner-slide"
          :style="{ backgroundImage: `url(${img})` }"
        ></div>
      </transition-group>

      <!-- Navigation Dots -->
      <div class="carousel-dots">
        <button
          v-for="(_, index) in store.config.bannerImages"
          :key="index"
          :class="{ active: index === currentIndex }"
          @click="goToSlide(index)"
        ></button>
      </div>
    </div>
    <div class="hero-overlay">
      <div
        v-if="store.config.logoUrl"
        class="glitch-logo"
        :style="{ '--logo-url': `url(${store.config.logoUrl})` }"
      ></div>
      <h1 v-else class="glitch" data-text="DEVIL'S DEAL">DEVIL'S DEAL</h1>
      <p>{{ $t("hero.subtitle") }}</p>
    </div>
  </section>
</template>

<style scoped>
.hero {
  height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
}

.banner-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.banner-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  filter: brightness(0.4);
}

.carousel-dots {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
  z-index: 3;
}

.carousel-dots button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #fff;
  background: transparent;
  cursor: pointer;
  padding: 0;
  transition: 0.3s;
}

.carousel-dots button.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  transform: scale(1.2);
}

.hero-overlay {
  z-index: 2;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

h1 {
  font-family: var(--font-display);
  font-size: 5rem;
  color: var(--color-primary);
  text-shadow: 0 0 20px rgba(138, 3, 3, 0.8);
  margin-bottom: 1rem;
}

p {
  font-size: 1.5rem;
  letter-spacing: 5px;
  color: #fff;
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Text Glitch Effect (Fallback) */
.glitch {
  position: relative;
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
}

.glitch::before {
  left: 2px;
  text-shadow: -1px 0 red;
  clip: rect(24px, 550px, 90px, 0);
  animation: glitch-anim-1 2.5s infinite linear alternate-reverse;
}

.glitch::after {
  left: -2px;
  text-shadow: -1px 0 blue;
  clip: rect(85px, 550px, 140px, 0);
  animation: glitch-anim-2 3s infinite linear alternate-reverse;
}

/* Logo Glitch Effect */
.glitch-logo {
  width: 400px;
  height: 200px;
  background-image: var(--logo-url);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
  margin-bottom: 1rem;
}

.glitch-logo::before,
.glitch-logo::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: var(--logo-url);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.7;
}

.glitch-logo::before {
  left: 3px;
  animation: glitch-anim-logo-1 2.5s infinite linear alternate-reverse;
  filter: drop-shadow(-2px 0 black);
}

.glitch-logo::after {
  left: -3px;
  animation: glitch-anim-logo-2 3s infinite linear alternate-reverse;
  filter: drop-shadow(2px 0 black);
}

@keyframes glitch-anim-1 {
  0% {
    clip: rect(20px, 9999px, 80px, 0);
  }
  20% {
    clip: rect(100px, 9999px, 140px, 0);
  }
  40% {
    clip: rect(50px, 9999px, 90px, 0);
  }
  60% {
    clip: rect(10px, 9999px, 60px, 0);
  }
  80% {
    clip: rect(120px, 9999px, 160px, 0);
  }
  100% {
    clip: rect(30px, 9999px, 70px, 0);
  }
}

@keyframes glitch-anim-2 {
  0% {
    clip: rect(120px, 9999px, 160px, 0);
  }
  20% {
    clip: rect(30px, 9999px, 70px, 0);
  }
  40% {
    clip: rect(100px, 9999px, 140px, 0);
  }
  60% {
    clip: rect(50px, 9999px, 90px, 0);
  }
  80% {
    clip: rect(10px, 9999px, 60px, 0);
  }
  100% {
    clip: rect(20px, 9999px, 80px, 0);
  }
}

@keyframes glitch-anim-logo-1 {
  0% {
    clip-path: inset(10% 0 60% 0);
  }
  20% {
    clip-path: inset(30% 0 10% 0);
  }
  40% {
    clip-path: inset(50% 0 30% 0);
  }
  60% {
    clip-path: inset(10% 0 80% 0);
  }
  80% {
    clip-path: inset(70% 0 10% 0);
  }
  100% {
    clip-path: inset(20% 0 50% 0);
  }
}

@keyframes glitch-anim-logo-2 {
  0% {
    clip-path: inset(60% 0 10% 0);
  }
  20% {
    clip-path: inset(10% 0 50% 0);
  }
  40% {
    clip-path: inset(40% 0 20% 0);
  }
  60% {
    clip-path: inset(20% 0 70% 0);
  }
  80% {
    clip-path: inset(80% 0 5% 0);
  }
  100% {
    clip-path: inset(30% 0 40% 0);
  }
}

@media (max-width: 768px) {
  h1 {
    font-size: 3rem;
  }

  p {
    font-size: 1rem;
    letter-spacing: 2px;
  }

  .glitch-logo {
    width: 280px;
    height: 140px;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 2.2rem;
  }

  p {
    font-size: 0.9rem;
    letter-spacing: 1px;
  }

  .glitch-logo {
    width: 220px;
    height: 110px;
  }
}
</style>
