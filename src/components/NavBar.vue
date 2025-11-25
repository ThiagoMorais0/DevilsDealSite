<script setup lang="ts">
import { ref } from "vue";
import { useBandStore } from "../stores/bandStore";
import LanguageSwitcher from "./LanguageSwitcher.vue";

const store = useBandStore();
const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const scrollTo = (id: string) => {
  closeMenu();
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
};
</script>

<template>
  <nav class="navbar">
    <div class="container nav-content">
      <div class="logo" v-if="store.config.logoUrl">
        <img :src="store.config.logoUrl" alt="Devil's Deal" />
      </div>
      <div class="logo-text" v-else>DEVIL'S DEAL</div>

      <button
        class="hamburger"
        @click="toggleMenu"
        :class="{ active: isMenuOpen }"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div class="nav-menu" :class="{ active: isMenuOpen }">
        <ul class="nav-links">
          <li>
            <a href="#" @click.prevent="scrollTo('home')">{{
              $t("nav.home")
            }}</a>
          </li>
          <li>
            <a href="#" @click.prevent="scrollTo('agenda')">{{
              $t("nav.agenda")
            }}</a>
          </li>
          <li>
            <a href="#" @click.prevent="scrollTo('about')">{{
              $t("nav.about")
            }}</a>
          </li>
          <li>
            <a href="#" @click.prevent="scrollTo('members')">{{
              $t("nav.members")
            }}</a>
          </li>
          <li>
            <a href="#" @click.prevent="scrollTo('repertoire')">{{
              $t("nav.repertoire")
            }}</a>
          </li>
          <li>
            <a href="#" @click.prevent="scrollTo('merch')">{{
              $t("nav.merch")
            }}</a>
          </li>
          <li>
            <a href="#" @click.prevent="scrollTo('gallery')">{{
              $t("nav.gallery")
            }}</a>
          </li>
          <li>
            <a href="#" @click.prevent="scrollTo('contact')">{{
              $t("nav.contact")
            }}</a>
          </li>
        </ul>
        <div class="mobile-lang">
          <LanguageSwitcher />
        </div>
      </div>

      <div class="desktop-lang">
        <LanguageSwitcher />
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.95);
  border-bottom: 2px solid var(--color-primary);
  z-index: 1000;
  padding: 1rem 0;
  backdrop-filter: blur(5px);
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.5rem;
}

.logo img {
  height: 50px;
}

.logo-text {
  font-family: var(--font-display);
  font-size: 1.5rem;
  color: var(--color-primary);
  font-weight: bold;
  letter-spacing: 2px;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
  list-style: none;
}

.nav-links a {
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 1px;
  font-size: 0.9rem;
  color: #fff;
  text-decoration: none;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: var(--color-primary);
  text-shadow: 0 0 10px var(--color-primary);
}

.hamburger {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 21px;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 1001;
}

.hamburger span {
  display: block;
  width: 100%;
  height: 3px;
  background: var(--color-primary);
  transition: all 0.3s ease;
}

.hamburger.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -7px);
}

.mobile-lang {
  display: none;
}

.desktop-lang {
  display: block;
}

/* Mobile Styles */
@media (max-width: 992px) {
  .hamburger {
    display: flex;
  }

  .nav-menu {
    position: fixed;
    top: 0;
    right: -100%;
    width: 70%;
    height: 100vh;
    background: #000;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: right 0.3s ease;
    border-left: 1px solid #333;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.5);
  }

  .nav-menu.active {
    right: 0;
  }

  .nav-links {
    flex-direction: column;
    gap: 2rem;
  }

  .nav-links a {
    font-size: 1.2rem;
  }

  .desktop-lang {
    display: none;
  }

  .mobile-lang {
    display: block;
    margin-top: 2rem;
  }
}
</style>
