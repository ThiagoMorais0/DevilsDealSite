<script setup lang="ts">
import { watch } from "vue";
import { RouterView, useRoute } from "vue-router";
import { useBandStore } from "./stores/bandStore";
import SmokeEffect from "./components/SmokeEffect.vue";

const store = useBandStore();
const route = useRoute();

// Update Favicon based on store config
watch(
  () => store.config.logoUrl,
  (newLogo) => {
    if (newLogo) {
      const link = document.querySelector(
        "link[rel~='icon']"
      ) as HTMLLinkElement;
      if (link) {
        link.href = newLogo;
      } else {
        const newLink = document.createElement("link");
        newLink.rel = "icon";
        newLink.href = newLogo;
        document.head.appendChild(newLink);
      }
    }
  },
  { immediate: true }
);

// Update Title based on Route (Base logic)
watch(
  () => route.name,
  (newName) => {
    if (newName === "admin") {
      document.title = "Devil's Deal | Admin";
    } else if (newName === "home") {
      document.title = "Devil's Deal | Home";
    }
  }
);
</script>

<template>
  <SmokeEffect />
  <RouterView />
</template>

<style scoped></style>
