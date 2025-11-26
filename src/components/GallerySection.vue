<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useBandStore, type Album, type Photo } from "../stores/bandStore";

const store = useBandStore();
const activeTab = ref<"all" | "albums">("albums");
const selectedAlbum = ref<Album | null>(null);
const lightboxOpen = ref(false);
const lightboxImage = ref("");

onMounted(() => {
  store.fetchGallery();
});

// Flatten all photos for "All Photos" view
const allPhotos = computed(() => {
  const photos: Photo[] = [];
  store.albums.forEach((album) => {
    if (album.photos) {
      photos.push(...album.photos);
    }
  });
  return photos;
});

const openAlbum = (album: Album) => {
  selectedAlbum.value = album;
  activeTab.value = "albums"; // Keep in albums tab but show detail
};

const backToAlbums = () => {
  selectedAlbum.value = null;
};

const openLightbox = (url: string) => {
  lightboxImage.value = url;
  lightboxOpen.value = true;
};

const closeLightbox = () => {
  lightboxOpen.value = false;
  lightboxImage.value = "";
};
</script>

<template>
  <section id="gallery" class="gallery-section">
    <div class="container">
      <h2 class="section-title">{{ $t("gallery.title") }}</h2>

      <!-- Tabs -->
      <div class="gallery-tabs">
        <button
          :class="{ active: activeTab === 'all' }"
          @click="
            activeTab = 'all';
            selectedAlbum = null;
          "
        >
          {{ $t("gallery.allPhotos") }}
        </button>
        <button
          :class="{ active: activeTab === 'albums' }"
          @click="activeTab = 'albums'"
        >
          {{ $t("gallery.albums") }}
        </button>
      </div>

      <!-- All Photos View -->
      <div v-if="activeTab === 'all'" class="photos-grid fade-in">
        <div
          v-for="photo in allPhotos"
          :key="photo.id"
          class="photo-card"
          @click="openLightbox(photo.url)"
        >
          <img :src="photo.url" loading="lazy" />
        </div>
      </div>

      <!-- Albums View -->
      <div
        v-if="activeTab === 'albums' && !selectedAlbum"
        class="albums-grid fade-in"
      >
        <div
          v-for="album in store.albums"
          :key="album.id"
          class="album-card"
          @click="openAlbum(album)"
        >
          <div class="album-cover">
            <img
              :src="album.cover_url || '/placeholder-album.jpg'"
              loading="lazy"
            />
            <div class="album-overlay">
              <span>{{ album.photos?.length || 0 }} photos</span>
            </div>
          </div>
          <h3>{{ album.title }}</h3>
          <p>{{ album.description }}</p>
        </div>
      </div>

      <!-- Single Album View -->
      <div
        v-if="activeTab === 'albums' && selectedAlbum"
        class="single-album-view fade-in"
      >
        <button @click="backToAlbums" class="back-btn">
          &larr; {{ $t("gallery.backToAlbums") }}
        </button>
        <h3>{{ selectedAlbum.title }}</h3>
        <p class="album-desc">{{ selectedAlbum.description }}</p>

        <div class="photos-grid">
          <div
            v-for="photo in selectedAlbum.photos"
            :key="photo.id"
            class="photo-card"
            @click="openLightbox(photo.url)"
          >
            <img :src="photo.url" loading="lazy" />
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <div v-if="lightboxOpen" class="lightbox" @click="closeLightbox">
      <button class="close-btn">&times;</button>
      <img :src="lightboxImage" @click.stop />
    </div>
  </section>
</template>

<style scoped>
.gallery-section {
  background: #000;
  color: #fff;
  padding: 4rem 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  font-family: var(--font-display);
  font-size: 3rem;
  color: var(--color-primary);
  margin-bottom: 2rem;
  text-transform: uppercase;
}

.gallery-tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.gallery-tabs button {
  background: transparent;
  border: 1px solid #333;
  color: #888;
  padding: 0.8rem 2rem;
  cursor: pointer;
  font-family: var(--font-display);
  font-size: 1.2rem;
  transition: 0.3s;
  text-transform: uppercase;
}

.gallery-tabs button.active,
.gallery-tabs button:hover {
  border-color: var(--color-primary);
  color: #fff;
  background: rgba(138, 3, 3, 0.1);
}

/* Grids */
.photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.photo-card {
  aspect-ratio: 3/4;
  overflow: hidden;
  cursor: pointer;
  border-radius: 4px;
  position: relative;
}

.photo-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.photo-card:hover img {
  transform: scale(1.05);
}

/* Albums */
.albums-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.album-card {
  cursor: pointer;
  transition: transform 0.3s;
}

.album-card:hover {
  transform: translateY(-5px);
}

.album-cover {
  position: relative;
  height: 300px;
  overflow: hidden;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.album-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.album-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: 0.3s;
}

.album-card:hover .album-overlay {
  opacity: 1;
}

.album-overlay span {
  border: 1px solid #fff;
  padding: 0.5rem 1rem;
  color: #fff;
  text-transform: uppercase;
  font-size: 0.9rem;
}

.album-card h3 {
  font-family: var(--font-display);
  font-size: 1.5rem;
  color: #fff;
  margin-bottom: 0.5rem;
}

.album-card p {
  color: #888;
  font-size: 0.9rem;
}

/* Single Album View */
.back-btn {
  background: transparent;
  border: none;
  color: var(--color-primary);
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
}

.back-btn:hover {
  text-decoration: underline;
}

.album-desc {
  color: #ccc;
  margin-bottom: 2rem;
  max-width: 800px;
}

/* Lightbox */
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.lightbox img {
  max-width: 100%;
  max-height: 90vh;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 3rem;
  cursor: pointer;
}

/* Animations */
.fade-in {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2.5rem;
  }

  .gallery-tabs {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }

  .gallery-tabs button {
    width: 100%;
    padding: 0.8rem;
  }

  .photos-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }

  .albums-grid {
    grid-template-columns: 1fr;
  }
}
</style>
