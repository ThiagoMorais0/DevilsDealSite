<script setup lang="ts"></script>

<template>
  <section id="contact" class="section-dark">
    <div class="container">
      <h2 class="section-title">{{ $t("contact.title") }}</h2>

      <form class="contact-form" @submit.prevent>
        <div class="form-group">
          <input type="text" :placeholder="$t('contact.name')" required />
        </div>
        <div class="form-group">
          <input type="email" :placeholder="$t('contact.email')" required />
        </div>
        <div class="form-group">
          <textarea
            rows="5"
            :placeholder="$t('contact.message')"
            required
          ></textarea>
        </div>
        <button type="submit">{{ $t("contact.send") }}</button>
      </form>

      <div class="socials">
        <a href="#">Instagram</a>
        <a href="#">Facebook</a>
        <a href="#">Spotify</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section-dark {
  background: #050505;
  padding: 5rem 0;
  text-align: center;
}

.section-title {
  font-family: var(--font-display);
  font-size: 3rem;
  color: var(--color-primary);
  margin-bottom: 3rem;
  text-transform: uppercase;
}

.contact-form {
  max-width: 600px;
  margin: 0 auto 3rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

input,
textarea {
  width: 100%;
  padding: 1rem;
  background: #111;
  border: 1px solid #333;
  color: #fff;
  border-radius: 4px;
  font-family: var(--font-main);
}

input:focus,
textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

button {
  background: var(--color-primary);
  color: #fff;
  border: none;
  padding: 1rem 3rem;
  font-size: 1.1rem;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  transition: 0.3s;
}

button:hover {
  background: #a00;
  transform: scale(1.05);
}

.socials {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 3rem;
}

.socials a {
  color: #888;
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.socials a:hover {
  color: #fff;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2.5rem;
  }

  .contact-form {
    padding: 0 1rem;
  }

  .socials {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
