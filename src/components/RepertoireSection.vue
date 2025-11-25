<script setup lang="ts">
import { useBandStore } from "../stores/bandStore";
import { useI18n } from "vue-i18n";

const store = useBandStore();
const { t } = useI18n();
</script>

<template>
  <section id="repertoire" class="repertoire-section">
    <div class="container">
      <div class="header-content" data-aos="fade-up">
        <h2 class="section-title">
          {{ t("repertoire.title") }}
        </h2>
        <p class="section-subtitle">{{ t("repertoire.subtitle") }}</p>
      </div>

      <div class="songs-list">
        <div
          v-for="song in store.songs"
          :key="song.id"
          class="song-card"
          data-aos="fade-up"
        >
          <div class="song-info">
            <h3 class="song-title">{{ song.title }}</h3>
          </div>
          <a :href="song.url" target="_blank" class="listen-btn">
            <span class="icon">▶</span>
            <span class="text">{{ t("repertoire.listen") }}</span>
          </a>
        </div>
      </div>

      <div v-if="store.songs.length === 0" class="no-songs">
        <p>Repertoire coming soon...</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.repertoire-section {
  padding: 6rem 2rem;
  background-color: #000;
  color: #fff;
  position: relative;
}

.container {
  max-width: 800px; /* Narrower container for list view */
  margin: 0 auto;
}

.header-content {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  font-family: "Cinzel", serif;
  color: var(--color-primary);
  text-shadow: 0 0 10px rgba(220, 20, 60, 0.5);
}

.section-subtitle {
  font-size: 1.2rem;
  color: #aaa;
  font-style: italic;
}

.songs-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.song-card {
  background: rgba(20, 20, 20, 0.8);
  border: 1px solid #333;
  padding: 1.5rem 2rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.song-card:hover {
  border-color: var(--color-primary);
  transform: translateX(10px); /* Slide right on hover */
  background: rgba(30, 30, 30, 0.9);
}

.song-title {
  font-size: 1.3rem;
  font-weight: bold;
  margin: 0;
  color: #eee;
}

.listen-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  padding: 0.5rem 1.2rem;
  border-radius: 30px; /* Pill shape */
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.listen-btn:hover {
  background: var(--color-primary);
  color: #fff;
  box-shadow: 0 0 15px rgba(220, 20, 60, 0.4);
}

.listen-btn .icon {
  font-size: 0.8rem;
}

.no-songs {
  text-align: center;
  color: #666;
  font-style: italic;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2.5rem;
  }

  .song-card {
    padding: 1rem;
  }

  .song-title {
    font-size: 1.1rem;
  }
}
</style>
