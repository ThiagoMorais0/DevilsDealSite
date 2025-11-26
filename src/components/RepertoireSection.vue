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
            <div class="icon-wrapper">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M9 18V5l12-2v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
              </svg>
            </div>
            <h3 class="song-title">{{ song.title }}</h3>
          </div>
          <a :href="song.url" target="_blank" class="listen-btn">
            <span class="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="none"
              >
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </span>
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
  background-color: #050505;
  color: #fff;
  position: relative;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

.header-content {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  font-family: var(--font-display);
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 2px;
}

.section-subtitle {
  font-size: 1.2rem;
  color: #888;
  font-style: italic;
}

.songs-list {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.song-card {
  background: linear-gradient(145deg, #111, #0a0a0a);
  border: 1px solid #222;
  padding: 1.5rem 2rem;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
}

.song-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--color-primary);
  opacity: 0;
  transition: 0.3s;
}

.song-card:hover {
  border-color: #333;
  transform: translateX(5px);
  background: #161616;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.song-card:hover::before {
  opacity: 1;
}

.song-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.icon-wrapper {
  width: 40px;
  height: 40px;
  background: #1a1a1a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  transition: 0.3s;
}

.song-card:hover .icon-wrapper {
  background: var(--color-primary);
  color: #fff;
  transform: rotate(10deg);
}

.song-title {
  font-size: 1.2rem;
  font-weight: 500;
  margin: 0;
  color: #ddd;
  font-family: var(--font-main);
  letter-spacing: 0.5px;
}

.song-card:hover .song-title {
  color: #fff;
}

.listen-btn {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: transparent;
  border: 1px solid #333;
  color: #888;
  padding: 0.6rem 1.5rem;
  border-radius: 50px;
  text-decoration: none;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 1px;
}

.listen-btn:hover {
  background: #fff;
  color: #000;
  border-color: #fff;
  transform: scale(1.05);
}

.listen-btn .icon {
  display: flex;
  align-items: center;
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
    padding: 1.2rem;
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
    align-items: center;
  }

  .song-info {
    flex-direction: column;
    gap: 1rem;
  }

  .song-card::before {
    width: 100%;
    height: 4px;
    top: 0;
    left: 0;
  }

  .song-card:hover {
    transform: translateY(-5px);
  }

  .listen-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
