<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const switchLanguage = (lang: string) => {
  locale.value = lang
}
</script>

<template>
  <div class="language-switcher">
    <button 
      @click="switchLanguage('pt')" 
      :class="{ active: locale === 'pt' }"
      title="Português"
    >
      🇧🇷
    </button>
    <button 
      @click="switchLanguage('en')" 
      :class="{ active: locale === 'en' }"
      title="English"
    >
      🇺🇸
    </button>
  </div>
</template>

<style scoped>
.language-switcher {
  display: flex;
  gap: 0.5rem;
}

button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s, transform 0.2s;
  padding: 0;
}

button:hover {
  opacity: 1;
  transform: scale(1.1);
}

button.active {
  opacity: 1;
  transform: scale(1.1);
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
}
</style>
