<script setup lang="ts">
import { ref } from "vue";
import { useBandStore } from "../stores/bandStore";
import Swal from "sweetalert2";

const props = defineProps<{
  modelValue: string | string[] | undefined | null;
  multiple?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string | string[] | undefined | null): void;
}>();

const store = useBandStore();
const isUploading = ref(false);
const uploadProgress = ref(0);
const totalFiles = ref(0);
const currentFileIndex = ref(0);
const fileInput = ref<HTMLInputElement | null>(null);

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  isUploading.value = true;
  totalFiles.value = target.files.length;
  currentFileIndex.value = 0;
  uploadProgress.value = 0;

  try {
    const newUrls: string[] = [];

    for (let i = 0; i < target.files.length; i++) {
      currentFileIndex.value = i + 1;
      const file = target.files[i];
      if (!file) continue;
      const url = await store.uploadImage(file);
      if (url) {
        newUrls.push(url);
      }
      // Calculate progress based on files processed
      uploadProgress.value = Math.round(((i + 1) / target.files.length) * 100);
    }

    if (props.multiple) {
      const currentValues = Array.isArray(props.modelValue)
        ? props.modelValue
        : [];
      emit("update:modelValue", [...currentValues, ...newUrls]);

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "#111",
        color: "#fff",
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: "success",
        title: `${newUrls.length} imagens enviadas!`,
      });
    } else {
      // If single mode, take the last uploaded one
      if (newUrls.length > 0) {
        emit("update:modelValue", newUrls[0]!);
      }
    }
  } catch (error) {
    console.error("Upload failed:", error);
    Swal.fire({
      icon: "error",
      title: "Erro no Upload",
      text: "Não foi possível enviar as imagens.",
      background: "#111",
      color: "#fff",
      confirmButtonColor: "#d32f2f",
    });
  } finally {
    isUploading.value = false;
    if (fileInput.value) fileInput.value.value = "";
    uploadProgress.value = 0;
  }
};

const removeImage = (index: number) => {
  if (props.multiple && Array.isArray(props.modelValue)) {
    const newValues = [...props.modelValue];
    newValues.splice(index, 1);
    emit("update:modelValue", newValues);
  } else {
    emit("update:modelValue", "");
  }
};
</script>

<template>
  <div class="image-upload">
    <div class="upload-controls">
      <input
        type="file"
        ref="fileInput"
        @change="handleFileChange"
        accept="image/*"
        :multiple="multiple"
        :disabled="isUploading"
        class="file-input"
      />
    </div>

    <!-- Progress Bar -->
    <div v-if="isUploading" class="progress-container">
      <div class="progress-info">
        <span>Enviando {{ currentFileIndex }} de {{ totalFiles }}...</span>
        <span>{{ uploadProgress }}%</span>
      </div>
      <div class="progress-bar-bg">
        <div
          class="progress-bar-fill"
          :style="{ width: uploadProgress + '%' }"
        ></div>
      </div>
    </div>

    <!-- Preview for Single Image -->
    <div
      v-if="!multiple && modelValue && typeof modelValue === 'string'"
      class="preview-single"
    >
      <img :src="modelValue" alt="Preview" />
      <button @click="removeImage(0)" class="remove-btn">&times;</button>
    </div>

    <!-- Preview for Multiple Images -->
    <div
      v-if="multiple && Array.isArray(modelValue) && modelValue.length > 0"
      class="preview-grid"
    >
      <div v-for="(url, index) in modelValue" :key="index" class="preview-item">
        <img :src="url" alt="Preview" />
        <button @click="removeImage(index)" class="remove-btn">&times;</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.image-upload {
  width: 100%;
}

.upload-controls {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.file-input {
  background: #222;
  color: #fff;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #444;
  width: 100%;
  cursor: pointer;
}

.file-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Progress Bar Styles */
.progress-container {
  margin-bottom: 1rem;
  background: #1a1a1a;
  padding: 0.8rem;
  border-radius: 4px;
  border: 1px solid #333;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #ccc;
}

.progress-bar-bg {
  width: 100%;
  height: 8px;
  background: #333;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: var(--color-primary);
  transition: width 0.3s ease;
}

.preview-single {
  position: relative;
  width: 150px;
  height: 150px;
  border: 1px solid #444;
  border-radius: 4px;
  overflow: hidden;
}

.preview-single img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.5rem;
}

.preview-item {
  position: relative;
  width: 100px;
  height: 100px;
  border: 1px solid #444;
  border-radius: 4px;
  overflow: hidden;
}

.preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-btn {
  position: absolute;
  top: 2px;
  right: 2px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  line-height: 1;
}

.remove-btn:hover {
  background: red;
}
</style>
