<script setup lang="ts">
import { useBandStore } from '../stores/bandStore'

const store = useBandStore()
</script>

<template>
  <section id="about" class="section-light">
    <div class="container">
      <h2 class="section-title">{{ $t('about.title') }}</h2>
      <div class="content-box" v-html="store.config.aboutText"></div>
    </div>
  </section>
</template>

<style scoped>
.section-light {
  background: #1a1a1a; /* Not actually light, just lighter dark */
  padding: 5rem 0;
  position: relative;
}

/* Texture overlay */
.section-light::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23222222' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.1;
  pointer-events: none;
}

.section-title {
  font-family: var(--font-display);
  font-size: 3rem;
  color: #fff;
  text-align: center;
  margin-bottom: 3rem;
  text-transform: uppercase;
  border-bottom: 2px solid var(--color-primary);
  display: inline-block;
  padding-bottom: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
}

.content-box {
  max-width: 800px;
  margin: 0 auto;
  color: #ccc;
  font-size: 1.1rem;
  line-height: 1.8;
  text-align: justify;
}

/* Deep selector for v-html content */
:deep(b), :deep(strong) {
  color: var(--color-primary);
}
</style>
