<script setup lang="ts">
import { useBandStore } from "../stores/bandStore";
import { useI18n } from "vue-i18n";

const store = useBandStore();
const { t } = useI18n();
</script>

<template>
  <section id="rider" class="rider-section">
    <div class="container">
      <h2 class="section-title">{{ t("rider.title") }}</h2>

      <!-- Stage Map -->
      <div v-if="store.config.stageMapUrl" class="stage-map-container">
        <h3>{{ t("rider.stageMap") }}</h3>
        <div class="map-wrapper">
          <img :src="store.config.stageMapUrl" alt="Mapa de Palco" />
        </div>
        <a :href="store.config.stageMapUrl" target="_blank" class="download-btn">
          {{ t("rider.downloadMap") }}
        </a>
      </div>

      <!-- Technical Rider List -->
      <div class="rider-list-container">
        <h3>{{ t("rider.equipmentList") }}</h3>
        <div class="rider-grid">
          <div
            v-for="item in store.technicalRider"
            :key="item.id"
            class="rider-card"
          >
            <div class="card-header">
              <h4>{{ item.name }}</h4>
              <span class="quantity">{{ item.quantity }}x</span>
            </div>
            <div class="card-body">
              <p v-if="item.minimum">
                <strong>{{ t("rider.minimum") }}:</strong> {{ item.minimum }}
              </p>
              <p v-if="item.alternative">
                <strong>{{ t("rider.alternative") }}:</strong>
                {{ item.alternative }}
              </p>
              <p v-if="item.observations" class="obs">
                <strong>{{ t("rider.observations") }}:</strong>
                {{ item.observations }}
              </p>
            </div>
            <div v-if="item.photos && item.photos.length > 0" class="item-photos">
              <img
                v-for="(photo, index) in item.photos"
                :key="index"
                :src="photo"
                :alt="item.name"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.rider-section {
  background: #0a0a0a;
  padding: 5rem 2rem;
  color: #fff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-family: var(--font-display);
  font-size: 3rem;
  text-align: center;
  margin-bottom: 3rem;
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 2px;
}

h3 {
  font-family: var(--font-display);
  font-size: 2rem;
  color: #fff;
  margin-bottom: 1.5rem;
  border-left: 4px solid var(--color-primary);
  padding-left: 1rem;
}

/* Stage Map */
.stage-map-container {
  margin-bottom: 4rem;
  text-align: center;
}

.map-wrapper {
  max-width: 800px;
  margin: 0 auto 1.5rem;
  border: 1px solid #333;
  border-radius: 8px;
  overflow: hidden;
  background: #111;
}

.map-wrapper img {
  width: 100%;
  height: auto;
  display: block;
}

.download-btn {
  display: inline-block;
  background: var(--color-primary);
  color: #fff;
  padding: 0.8rem 2rem;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  transition: 0.3s;
}

.download-btn:hover {
  background: #a00;
}

/* Rider List */
.rider-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.rider-card {
  background: #151515;
  border: 1px solid #333;
  border-radius: 8px;
  overflow: hidden;
  transition: 0.3s;
}

.rider-card:hover {
  transform: translateY(-5px);
  border-color: var(--color-primary);
}

.card-header {
  background: #222;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #333;
}

.card-header h4 {
  margin: 0;
  color: var(--color-primary);
  font-size: 1.2rem;
}

.quantity {
  background: #333;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.9rem;
}

.card-body {
  padding: 1rem;
}

.card-body p {
  margin-bottom: 0.5rem;
  color: #ccc;
  font-size: 0.95rem;
}

.card-body strong {
  color: #fff;
}

.obs {
  font-style: italic;
  color: #aaa;
  margin-top: 0.5rem;
}

.item-photos {
  display: flex;
  gap: 0.5rem;
  padding: 0 1rem 1rem;
  overflow-x: auto;
}

.item-photos img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #444;
}
</style>
