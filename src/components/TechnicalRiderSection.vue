<script setup lang="ts">
import { useBandStore } from "../stores/bandStore";
import { useI18n } from "vue-i18n";
import { getLocalized } from "../utils/i18nHelper";

const store = useBandStore();
const { t, locale } = useI18n();
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
        
        <div class="table-responsive">
          <table class="rider-table">
            <thead>
              <tr>
                <th>{{ t("rider.item") }}</th>
                <th>{{ t("rider.quantity") }}</th>
                <th>{{ t("rider.minimum") }}</th>
                <th>{{ t("rider.alternative") }}</th>
                <th>{{ t("rider.observations") }}</th>
                <th>Foto</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in store.technicalRider" :key="item.id">
                <td class="item-name">{{ getLocalized(item.name, locale) }}</td>
                <td class="text-center">{{ item.quantity }}</td>
                <td>{{ item.minimum || "-" }}</td>
                <td>{{ getLocalized(item.alternative, locale) || "-" }}</td>
                <td class="obs-cell">{{ getLocalized(item.observations, locale) || "-" }}</td>
                <td>
                  <div v-if="item.photos && item.photos.length > 0" class="table-photo">
                    <img :src="item.photos[0]" :alt="getLocalized(item.name, locale)" />
                  </div>
                  <span v-else>-</span>
                </td>
              </tr>
            </tbody>
          </table>
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

/* Rider Table */
.table-responsive {
  overflow-x: auto;
  background: #151515;
  border-radius: 8px;
  border: 1px solid #333;
}

.rider-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px; /* Ensure table doesn't squish too much */
}

.rider-table th,
.rider-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #222;
}

.rider-table th {
  background: #222;
  color: var(--color-primary);
  font-family: var(--font-display);
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 1px;
}

.rider-table tr:last-child td {
  border-bottom: none;
}

.rider-table tr:hover {
  background: #1a1a1a;
}

.item-name {
  font-weight: bold;
  color: #fff;
  font-size: 1.1rem;
}

.text-center {
  text-align: center !important;
}

.obs-cell {
  font-style: italic;
  color: #aaa;
  max-width: 300px;
}

.table-photo {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #444;
}

.table-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2.5rem;
  }
  
  /* On mobile, we might want to keep the scroll or switch to a stacked view if preferred.
     For now, the horizontal scroll is a safe bet for tables. */
}
</style>
