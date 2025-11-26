<script setup lang="ts">
import { useBandStore } from "../stores/bandStore";
import { computed } from "vue";

const store = useBandStore();

const isPast = (date: string) => {
  const showDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return showDate < today;
};

const upcomingShows = computed(() => {
  return store.shows
    .filter((s) => !isPast(s.date))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
});

const pastShows = computed(() => {
  return store.shows
    .filter((s) => isPast(s.date))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});
</script>

<template>
  <section id="agenda" class="section-dark">
    <div class="container">
      <h2 class="section-title">{{ $t("agenda.title") }}</h2>

      <div v-if="store.shows.length === 0" class="no-shows">
        <p>Nenhum show agendado no momento.</p>
      </div>

      <div class="shows-list">
        <!-- Upcoming Shows -->
        <div
          v-for="show in upcomingShows"
          :key="show.id"
          class="show-card"
        >
          <div class="date-box">
            <span class="day">{{ new Date(show.date).getDate() }}</span>
            <span class="month">{{
              new Date(show.date)
                .toLocaleString("pt-BR", { month: "short" })
                .toUpperCase()
            }}</span>
            <span class="year">{{ new Date(show.date).getFullYear() }}</span>
          </div>
          <div class="show-info">
            <h3>{{ show.venue }}</h3>
            <p>{{ show.address }}</p>
            <p class="time">Início: {{ show.time }}</p>
          </div>
          <div class="actions">
            <a
              :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(show.venue + ' ' + show.address)}`"
              target="_blank"
              class="action-btn map-btn"
              title="Ver no Mapa"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Mapa
            </a>
            <a
              v-for="(link, idx) in show.ticketLinks"
              :key="idx"
              :href="link"
              target="_blank"
              class="action-btn ticket-btn"
              title="Comprar Ingressos"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                <path d="M6 12h.01M18 12h.01"></path>
              </svg>
              {{ $t("agenda.buy_tickets") }}
            </a>
          </div>
        </div>

        <!-- Divider -->
        <div v-if="pastShows.length > 0 && upcomingShows.length > 0" class="shows-divider">
          <span>Shows Realizados</span>
        </div>

        <!-- Past Shows -->
        <div
          v-for="show in pastShows"
          :key="show.id"
          class="show-card past-show"
        >
          <div class="date-box">
            <span class="day">{{ new Date(show.date).getDate() }}</span>
            <span class="month">{{
              new Date(show.date)
                .toLocaleString("pt-BR", { month: "short" })
                .toUpperCase()
            }}</span>
            <span class="year">{{ new Date(show.date).getFullYear() }}</span>
          </div>
          <div class="show-info">
            <h3>
              {{ show.venue }}
              <span class="status-badge">Realizado</span>
            </h3>
            <p>{{ show.address }}</p>
            <p class="time">Início: {{ show.time }}</p>
          </div>
          <div class="actions">
            <a
              :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(show.venue + ' ' + show.address)}`"
              target="_blank"
              class="action-btn map-btn"
              title="Ver no Mapa"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Mapa
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section-dark {
  background: #0a0a0a;
  padding: 5rem 0;
}

.section-title {
  font-family: var(--font-display);
  font-size: 3rem;
  color: var(--color-primary);
  text-align: center;
  margin-bottom: 3rem;
  text-transform: uppercase;
}

.shows-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.show-card {
  background: #111;
  border: 1px solid #333;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  transition: 0.3s;
}

.show-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 0 15px rgba(138, 3, 3, 0.3);
  transform: translateX(5px);
}

/* Past Show Styles */
.past-show {
  opacity: 0.6;
  filter: grayscale(0.8);
  border-color: #222 !important;
}

.past-show:hover {
  transform: none;
  box-shadow: none;
}

.past-show .date-box {
  background: #444;
}

.status-badge {
  display: inline-block;
  background: #444;
  color: #ccc;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 0.5rem;
  vertical-align: middle;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.date-box {
  background: var(--color-primary);
  color: #fff;
  padding: 1rem;
  text-align: center;
  min-width: 80px;
  border-radius: 4px;
}

.date-box .day {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  line-height: 1;
}

.date-box .month {
  display: block;
  font-size: 0.9rem;
}

.date-box .year {
  display: block;
  font-size: 0.75rem;
  opacity: 0.9;
  margin-top: 2px;
}

.show-info {
  flex: 1;
}

.show-info h3 {
  font-size: 1.5rem;
  color: #fff;
  margin-bottom: 0.5rem;
}

.show-info p {
  color: #aaa;
}

.show-info .time {
  color: var(--color-primary);
  font-weight: bold;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-transform: uppercase;
  font-size: 0.9rem;
  font-weight: bold;
  text-decoration: none;
  transition: 0.3s;
}

.map-btn {
  background: transparent;
  border: 1px solid #666;
  color: #ccc;
}

.map-btn:hover {
  background: #333;
  color: #fff;
  border-color: #fff;
}

.ticket-btn {
  background: var(--color-primary);
  border: 1px solid var(--color-primary);
  color: #fff;
}

.ticket-btn:hover {
  background: #a00;
  border-color: #a00;
}

.no-shows {
  text-align: center;
  color: #666;
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .show-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .actions {
    width: 100%;
    flex-direction: column;
  }

  .action-btn {
    justify-content: center;
    width: 100%;
  }
}

.shows-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2rem 0;
  position: relative;
}

.shows-divider::before,
.shows-divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: #333;
}

.shows-divider span {
  padding: 0 1rem;
  color: #666;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 2px;
}
</style>
