<script setup lang="ts">
defineProps<{
  isOpen: boolean
  title: string
}>()

defineEmits<{
  (e: 'close'): void
  (e: 'save'): void
}>()
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <header class="modal-header">
        <h3>{{ title }}</h3>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </header>
      
      <div class="modal-body">
        <slot></slot>
      </div>

      <footer class="modal-footer">
        <button class="cancel-btn" @click="$emit('close')">Cancelar</button>
        <button class="save-btn" @click="$emit('save')">Confirmar</button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: #1a1a1a;
  width: 90%;
  max-width: 600px;
  border-radius: 8px;
  border: 1px solid #333;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  animation: slide-in 0.3s ease;
}

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  color: var(--color-primary);
  margin: 0;
  font-family: var(--font-display);
}

.close-btn {
  background: none;
  border: none;
  color: #888;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.close-btn:hover {
  color: #fff;
}

.modal-body {
  padding: 1.5rem;
  max-height: 70vh;
  overflow-y: auto;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #333;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-btn {
  background: transparent;
  border: 1px solid #444;
  color: #ccc;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn:hover {
  background: #333;
  color: #fff;
}

.save-btn {
  background: var(--color-primary);
  border: none;
  color: #fff;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.save-btn:hover {
  background: #a00;
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
