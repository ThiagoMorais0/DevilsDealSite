<script setup lang="ts">
import { ref } from "vue";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";

const form = ref({
  name: "",
  email: "",
  message: "",
});

const isSending = ref(false);

const sendEmail = async () => {
  if (!form.value.name || !form.value.email || !form.value.message) {
    Swal.fire({
      icon: "warning",
      title: "Campos obrigatórios",
      text: "Por favor, preencha todos os campos.",
      background: "#111",
      color: "#fff",
    });
    return;
  }

  isSending.value = true;

  try {
    // REPLACE THESE WITH YOUR ACTUAL EMAILJS KEYS
    const SERVICE_ID = "YOUR_SERVICE_ID";
    const TEMPLATE_ID = "YOUR_TEMPLATE_ID";
    const PUBLIC_KEY = "YOUR_PUBLIC_KEY";

    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        from_name: form.value.name,
        from_email: form.value.email,
        message: form.value.message,
        to_email: "thiagomface@gmail.com",
      },
      PUBLIC_KEY
    );

    Swal.fire({
      icon: "success",
      title: "Mensagem Enviada!",
      text: "Entraremos em contato em breve.",
      background: "#111",
      color: "#fff",
    });

    form.value = { name: "", email: "", message: "" };
  } catch (error) {
    console.error("EmailJS Error:", error);
    Swal.fire({
      icon: "error",
      title: "Erro ao enviar",
      text: "Ocorreu um erro ao enviar sua mensagem. Tente novamente mais tarde.",
      background: "#111",
      color: "#fff",
    });
  } finally {
    isSending.value = false;
  }
};
</script>

<template>
  <section id="contact" class="section-dark">
    <div class="container">
      <h2 class="section-title">{{ $t("contact.title") }}</h2>

      <form class="contact-form" @submit.prevent="sendEmail">
        <div class="form-group">
          <input
            v-model="form.name"
            type="text"
            :placeholder="$t('contact.name')"
            required
          />
        </div>
        <div class="form-group">
          <input
            v-model="form.email"
            type="email"
            :placeholder="$t('contact.email')"
            required
          />
        </div>
        <div class="form-group">
          <textarea
            v-model="form.message"
            rows="5"
            :placeholder="$t('contact.message')"
            required
          ></textarea>
        </div>
        <button type="submit" :disabled="isSending">
          {{ isSending ? "Enviando..." : $t("contact.send") }}
        </button>
      </form>

      <div class="socials">
        <a
          href="https://www.instagram.com/devilsdealband"
          target="_blank"
          class="insta-card"
        >
          <div class="insta-header">
            <div class="insta-avatar">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/2048px-Instagram_icon.png"
                alt="Instagram Logo"
              />
            </div>
            <div class="insta-info">
              <span class="insta-username">devilsdealband</span>
              <span class="insta-subtitle">Instagram</span>
            </div>
            <button class="insta-follow">Seguir</button>
          </div>
        </a>
        <a
          href="https://www.youtube.com/@DevilsDealBand"
          target="_blank"
          class="youtube-card"
        >
          <div class="youtube-header">
            <div class="youtube-avatar">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg"
                alt="YouTube Logo"
              />
            </div>
            <div class="youtube-info">
              <span class="youtube-username">DevilsDealBand</span>
              <span class="youtube-subtitle">YouTube</span>
            </div>
            <button class="youtube-subscribe">Seguir</button>
          </div>
        </a>
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
  flex-wrap: wrap;
}

.insta-card,
.youtube-card {
  background: #1f1f1f;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 1rem;
  text-decoration: none;
  width: 300px;
  transition: 0.3s;
  display: block;
}

.insta-card:hover {
  border-color: #e1306c;
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(225, 48, 108, 0.2);
}

.youtube-card:hover {
  border-color: #ff0000;
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(255, 0, 0, 0.2);
}

.insta-header,
.youtube-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.insta-avatar,
.youtube-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  padding: 2px;
  flex-shrink: 0;
}

.insta-avatar {
  border: 2px solid #e1306c;
}

.youtube-avatar {
  border: 2px solid #ff0000;
  background: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
}

.insta-avatar img,
.youtube-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.youtube-avatar img {
  object-fit: contain;
  width: 70%;
  height: 70%;
}

.insta-info,
.youtube-info {
  flex: 1;
  text-align: left;
  display: flex;
  flex-direction: column;
}

.insta-username,
.youtube-username {
  color: #fff;
  font-weight: bold;
  font-size: 0.9rem;
}

.insta-subtitle,
.youtube-subtitle {
  color: #888;
  font-size: 0.8rem;
}

.insta-follow,
.youtube-subscribe {
  color: #fff;
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
  cursor: pointer;
  text-transform: none;
}

.insta-follow {
  background: #0095f6;
}

.youtube-subscribe {
  background: #cc0000;
}

.insta-card:hover .insta-follow {
  background: #0085e0;
  transform: none;
}

.youtube-card:hover .youtube-subscribe {
  background: #ff0000;
  transform: none;
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
