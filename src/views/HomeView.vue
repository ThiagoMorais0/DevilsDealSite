<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import { useBandStore } from "../stores/bandStore";
import NavBar from "../components/NavBar.vue";
import HeroBanner from "../components/HeroBanner.vue";
import AgendaSection from "../components/AgendaSection.vue";
import AboutSection from "../components/AboutSection.vue";
import MembersSection from "../components/MembersSection.vue";
import RepertoireSection from "../components/RepertoireSection.vue";
import GallerySection from "../components/GallerySection.vue";
import MerchSection from "../components/MerchSection.vue";
import ContactSection from "../components/ContactSection.vue";

const { t } = useI18n();
const store = useBandStore();
let observer: IntersectionObserver | null = null;

onMounted(() => {
  store.fetchData();

  const sections = document.querySelectorAll("section");

  const options = {
    threshold: 0.3,
  };

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        let sectionName = "";

        switch (id) {
          case "home":
            sectionName = "Home";
            break;
          case "agenda":
            sectionName = "Agenda";
            break;
          case "about":
            sectionName = t("nav.about");
            break;
          case "members":
            sectionName = t("nav.members");
            break;
          case "repertoire":
            sectionName = t("nav.repertoire");
            break;
          case "gallery":
            sectionName = t("gallery.title");
            break;
          case "merch":
            sectionName = t("nav.merch");
            break;
          case "contact":
            sectionName = t("nav.contact");
            break;
        }

        if (sectionName) {
          document.title = `Devil's Deal | ${sectionName}`;
        }
      }
    });
  }, options);

  sections.forEach((section) => observer?.observe(section));
});

onUnmounted(() => {
  if (observer) observer.disconnect();
});
</script>

<template>
  <div class="home-container">
    <NavBar />

    <main>
      <HeroBanner />
      <AgendaSection />
      <AboutSection />
      <MembersSection />
      <RepertoireSection />
      <GallerySection />
      <MerchSection />
      <ContactSection />
    </main>

    <footer>
      <p>
        &copy; {{ new Date().getFullYear() }} Devil's Deal. Todos os direitos
        reservados.
      </p>
    </footer>
  </div>
</template>

<style scoped>
.home-container {
  background: #000;
  min-height: 100vh;
}

footer {
  background: #000;
  padding: 2rem;
  text-align: center;
  border-top: 1px solid #333;
  color: #666;
}

.credits {
  font-size: 0.8rem;
  margin-top: 0.5rem;
  color: #444;
}
</style>
