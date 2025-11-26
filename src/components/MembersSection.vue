<script setup lang="ts">
import { useBandStore } from "../stores/bandStore";

const store = useBandStore();
</script>

<template>
  <section id="members" class="section-dark">
    <div class="container">
      <h2 class="section-title">{{ $t("members.title") }}</h2>

      <div class="members-grid">
        <div
          v-for="member in store.members"
          :key="member.id"
          class="member-card"
        >
          <div class="photo-frame">
            <img
              :src="
                member.photos[0] ||
                'https://via.placeholder.com/300x400?text=No+Photo'
              "
              :alt="member.name"
            />
          </div>
          <div class="member-info">
            <h3>{{ member.name }}</h3>
            <span class="role">{{ member.role }}</span>
            <p>{{ member.description }}</p>
            <a
              v-if="member.instagram"
              :href="`https://www.instagram.com/${member.instagram.replace('@', '')}`"
              target="_blank"
              class="insta-link"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/2048px-Instagram_icon.png"
                alt="Instagram"
              />
              Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section-dark {
  background: #000;
  padding: 5rem 0;
}

.section-title {
  font-family: var(--font-display);
  font-size: 3rem;
  color: var(--color-primary);
  text-align: center;
  margin-bottom: 4rem;
  text-transform: uppercase;
}

.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  justify-content: center;
  max-width: 1400px;
  margin: 0 auto;
}

.member-card {
  background: #0a0a0a;
  border: 1px solid #222;
  overflow: hidden;
  transition: 0.3s;
  display: flex;
  flex-direction: column;
}

.member-card:hover {
  transform: translateY(-10px);
  border-color: var(--color-primary);
}

.photo-frame {
  height: 350px;
  overflow: hidden;
}

.photo-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: 0.5s;
  filter: grayscale(100%);
}

.member-card:hover .photo-frame img {
  transform: scale(1.1);
  filter: grayscale(0%);
}

.member-info {
  padding: 1.5rem 1rem;
  text-align: center;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.member-info h3 {
  font-size: 1.5rem;
  color: #fff;
  margin-bottom: 0.2rem;
  font-family: var(--font-display);
}

.role {
  display: block;
  color: var(--color-primary);
  font-weight: bold;
  margin-bottom: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 0.9rem;
}

.member-info p {
  color: #888;
  margin-bottom: 1.2rem;
  flex: 1;
  font-size: 0.9rem;
}

.insta-link {
  color: #fff;
  border-bottom: 1px solid var(--color-primary);
  padding-bottom: 2px;
  text-decoration: none;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.insta-link img {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.insta-link:hover {
  color: var(--color-primary);
}

@media (max-width: 768px) {
  .members-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 0 1rem;
  }

  .photo-frame {
    height: 400px;
  }
}
</style>
