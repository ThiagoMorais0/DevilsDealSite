<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  useBandStore,
  type Show,
  type Member,
  type Product,
  type Album,
  type TechnicalRiderItem,
} from "../stores/bandStore";
import BaseModal from "../components/BaseModal.vue";
import ImageUpload from "../components/ImageUpload.vue";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";

const store = useBandStore();
const router = useRouter();
const activeTab = ref("general");

// Authentication Logic
const isAuthenticated = ref(false);
const loginForm = ref({
  username: "",
  password: "",
});

const checkLogin = () => {
  if (
    loginForm.value.username === "admdd" &&
    loginForm.value.password === "@admdd2025"
  ) {
    isAuthenticated.value = true;
    localStorage.setItem("admin_auth", "true");
    showSuccess("Bem-vindo, Admin!");
  } else {
    Swal.fire({
      icon: "error",
      title: "Acesso Negado",
      text: "Credenciais inválidas.",
      background: "#111",
      color: "#fff",
    });
  }
};

const logout = () => {
  isAuthenticated.value = false;
  localStorage.removeItem("admin_auth");
  router.push("/");
};

onMounted(() => {
  if (localStorage.getItem("admin_auth") === "true") {
    isAuthenticated.value = true;
  }
});

// Helper for Confirmations
const confirmAction = async (
  title: string,
  text: string,
  callback: () => Promise<void> | void
) => {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sim, excluir!",
    cancelButtonText: "Cancelar",
    background: "#111",
    color: "#fff",
  });

  if (result.isConfirmed) {
    await callback();
    Swal.fire({
      title: "Excluído!",
      text: "O item foi removido.",
      icon: "success",
      background: "#111",
      color: "#fff",
      timer: 1500,
      showConfirmButton: false,
    });
  }
};

// Helper for Clear All Confirmation
const confirmClear = async (
  title: string,
  text: string,
  callback: () => Promise<void> | void
) => {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sim, limpar tudo!",
    cancelButtonText: "Cancelar",
    background: "#111",
    color: "#fff",
  });

  if (result.isConfirmed) {
    await callback();
    Swal.fire({
      title: "Limpo!",
      text: "Todos os itens foram removidos.",
      icon: "success",
      background: "#111",
      color: "#fff",
      timer: 1500,
      showConfirmButton: false,
    });
  }
};

// Helper for Success Toast
const showSuccess = (title: string) => {
  Swal.fire({
    icon: "success",
    title,
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: "#111",
    color: "#fff",
  });
};

// Banners
const newBannerUrls = ref<string[]>([]);
const addBanner = async () => {
  if (newBannerUrls.value.length > 0) {
    for (const url of newBannerUrls.value) {
      await store.addBanner(url);
    }
    newBannerUrls.value = [];
    showSuccess("Banners adicionados!");
  }
};
const removeBanner = (index: number) => {
  confirmAction("Remover Banner?", "Essa ação não pode ser desfeita.", () =>
    store.removeBanner(index)
  );
};

const clearBanners = () => {
  confirmClear(
    "Limpar Banners?",
    "Isso removerá todas as imagens do banner.",
    () => store.clearBanners()
  );
};

// Agenda
const newShow = ref({
  date: "",
  time: "",
  venue: "",
  address: "",
  ticketLinks: "",
});
const addShow = async () => {
  await store.addShow({
    ...newShow.value,
    ticketLinks: newShow.value.ticketLinks
      .split(",")
      .map((l) => l.trim())
      .filter((l) => l),
  });
  newShow.value = {
    date: "",
    time: "",
    venue: "",
    address: "",
    ticketLinks: "",
  };
  showSuccess("Show adicionado!");
};

const removeShow = (id: number) => {
  confirmAction("Remover Show?", "Essa ação não pode ser desfeita.", () =>
    store.removeShow(id)
  );
};

const clearShows = () => {
  confirmClear("Limpar Agenda?", "Isso removerá todos os shows cadastrados.", () =>
    store.clearShows()
  );
};

// Agenda Edit
const showModalOpen = ref(false);
const editingShow = ref<Show | null>(null);
const editShowForm = ref({
  id: 0,
  date: "",
  time: "",
  venue: "",
  address: "",
  ticketLinks: "",
});

const openEditShow = (show: Show) => {
  editingShow.value = show;
  editShowForm.value = {
    ...show,
    id: show.id || 0,
    ticketLinks: show.ticketLinks.join(", "),
  };
  showModalOpen.value = true;
};

const saveShow = async () => {
  if (editingShow.value) {
    await store.updateShow({
      ...editShowForm.value,
      ticketLinks: editShowForm.value.ticketLinks
        .split(",")
        .map((l) => l.trim())
        .filter((l) => l),
    });
    showModalOpen.value = false;
    showSuccess("Show atualizado!");
  }
};

// Members
const newMember = ref({
  name: "",
  role: "",
  description: "",
  instagram: "",
  photos: [] as string[],
});
const addMember = async () => {
  await store.addMember({
    ...newMember.value,
    photos: newMember.value.photos,
  });
  newMember.value = {
    name: "",
    role: "",
    description: "",
    instagram: "",
    photos: [],
  };
  showSuccess("Membro adicionado!");
};

const removeMember = (id: number) => {
  confirmAction("Remover Membro?", "Essa ação não pode ser desfeita.", () =>
    store.removeMember(id)
  );
};

const clearMembers = () => {
  confirmClear(
    "Limpar Membros?",
    "Isso removerá todos os membros cadastrados.",
    () => store.clearMembers()
  );
};

// Member Edit
const memberModalOpen = ref(false);
const editingMember = ref<Member | null>(null);
const editMemberForm = ref({
  id: 0,
  name: "",
  role: "",
  description: "",
  instagram: "",
  photos: [] as string[],
});

const openEditMember = (member: Member) => {
  editingMember.value = member;
  editMemberForm.value = {
    ...member,
    id: member.id || 0,
    photos: [...member.photos], // Clone array
  };
  memberModalOpen.value = true;
};

const saveMember = async () => {
  if (editingMember.value) {
    await store.updateMember({
      ...editMemberForm.value,
      photos: editMemberForm.value.photos, // Already an array
    });
    memberModalOpen.value = false;
    showSuccess("Membro atualizado!");
  }
};

// Merch
const newProduct = ref({
  name: "",
  description: "",
  price: 0,
  images: [] as string[],
  colors: "",
  sizes: "",
});
const addProduct = async () => {
  await store.addProduct({
    ...newProduct.value,
    images: newProduct.value.images, // Already array
    colors: newProduct.value.colors
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c),
    sizes: newProduct.value.sizes
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s),
  });
  newProduct.value = {
    name: "",
    description: "",
    price: 0,
    images: [],
    colors: "",
    sizes: "",
  };
  showSuccess("Produto adicionado!");
};

const removeProduct = (id: number) => {
  confirmAction("Remover Produto?", "Essa ação não pode ser desfeita.", () =>
    store.removeProduct(id)
  );
};

const clearProducts = () => {
  confirmClear(
    "Limpar Produtos?",
    "Isso removerá todos os produtos cadastrados.",
    () => store.clearProducts()
  );
};

// Merch Edit
const productModalOpen = ref(false);
const editingProduct = ref<Product | null>(null);
const editProductForm = ref({
  id: 0,
  name: "",
  description: "",
  price: 0,
  images: [] as string[],
  colors: "",
  sizes: "",
});

const openEditProduct = (product: Product) => {
  editingProduct.value = product;
  editProductForm.value = {
    ...product,
    id: product.id || 0,
    images: [...product.images], // Clone array
    colors: product.colors.join(", "),
    sizes: product.sizes.join(", "),
  };
  productModalOpen.value = true;
};

const saveProduct = async () => {
  if (editingProduct.value) {
    await store.updateProduct({
      ...editProductForm.value,
      images: editProductForm.value.images, // Already array
      colors: editProductForm.value.colors
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c),
      sizes: editProductForm.value.sizes
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
    });
    productModalOpen.value = false;
    showSuccess("Produto atualizado!");
  }
};

// Gallery
const newAlbum = ref({
  title: "",
  description: "",
  cover_url: "",
});

const addAlbum = async () => {
  await store.createAlbum(newAlbum.value);
  newAlbum.value = { title: "", description: "", cover_url: "" };
  showSuccess("Álbum criado!");
};

const deleteAlbum = (id: number) => {
  confirmAction("Excluir Álbum?", "Todas as fotos serão perdidas.", () =>
    store.deleteAlbum(id)
  );
};

const clearAlbums = () => {
  confirmClear(
    "Limpar Galeria?",
    "Isso removerá todos os álbuns e fotos.",
    () => store.clearAlbums()
  );
};

// Album Edit
const albumModalOpen = ref(false);
const editingAlbum = ref<Album | null>(null);
const editAlbumForm = ref({
  id: 0,
  title: "",
  description: "",
  cover_url: "",
});

const openEditAlbum = (album: Album) => {
  editingAlbum.value = album;
  editAlbumForm.value = { ...album };
  albumModalOpen.value = true;
};

const saveAlbum = async () => {
  if (editingAlbum.value) {
    await store.updateAlbum(editingAlbum.value.id, {
      title: editAlbumForm.value.title,
      description: editAlbumForm.value.description,
      cover_url: editAlbumForm.value.cover_url,
    });
    albumModalOpen.value = false;
    showSuccess("Álbum atualizado!");
  }
};

const newAlbumPhotos = ref<string[]>([]);
const addPhotosToAlbum = async (albumId: number) => {
  if (newAlbumPhotos.value.length > 0) {
    await store.addPhotosToAlbum(albumId, newAlbumPhotos.value);
    newAlbumPhotos.value = [];
    showSuccess("Fotos adicionadas!");
  }
};

const removePhoto = (photoId: number, albumId: number) => {
  confirmAction("Remover Foto?", "Essa ação não pode ser desfeita.", () =>
    store.removePhoto(photoId, albumId)
  );
};

// Drag and Drop Logic
const draggedMemberIndex = ref<number | null>(null);
const draggedPhotoIndex = ref<number | null>(null);
const draggedPhotoAlbumId = ref<number | null>(null);

// Members D&D
const onDragStartMember = (index: number) => {
  draggedMemberIndex.value = index;
};

const onDropMember = async (dropIndex: number) => {
  if (
    draggedMemberIndex.value === null ||
    draggedMemberIndex.value === dropIndex
  )
    return;

  const items = [...store.members];
  const [draggedItem] = items.splice(draggedMemberIndex.value, 1);
  if (draggedItem) {
    items.splice(dropIndex, 0, draggedItem);
    await store.reorderMembers(items);
    draggedMemberIndex.value = null;
    showSuccess("Ordem atualizada!");
  }
};

// Photos D&D
const onDragStartPhoto = (index: number, albumId: number) => {
  draggedPhotoIndex.value = index;
  draggedPhotoAlbumId.value = albumId;
};

const onDropPhoto = async (dropIndex: number, albumId: number) => {
  if (
    draggedPhotoIndex.value === null ||
    draggedPhotoAlbumId.value !== albumId ||
    draggedPhotoIndex.value === dropIndex
  )
    return;

  const album = store.albums.find((a) => a.id === albumId);
  if (!album || !album.photos) return;

  const items = [...album.photos];
  const [draggedItem] = items.splice(draggedPhotoIndex.value, 1);
  if (draggedItem) {
    items.splice(dropIndex, 0, draggedItem);
    await store.reorderPhotos(albumId, items);
    draggedPhotoIndex.value = null;
    draggedPhotoAlbumId.value = null;
    showSuccess("Ordem atualizada!");
  }
};

// Repertoire
const newSong = ref({
  title: "",
  url: "",
});

const addSong = async () => {
  if (!newSong.value.title || !newSong.value.url) {
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: "Preencha todos os campos!",
      background: "#111",
      color: "#fff",
    });
    return;
  }
  await store.addSong(newSong.value);
  newSong.value = { title: "", url: "" };
  showSuccess("Música adicionada!");
};

const removeSong = (id: number) => {
  confirmAction("Remover Música?", "Essa ação não pode ser desfeita.", () =>
    store.removeSong(id)
  );
};

const clearSongs = () => {
  confirmClear(
    "Limpar Repertório?",
    "Isso removerá todas as músicas cadastradas.",
    () => store.clearSongs()
  );
};

// Technical Rider
const newRiderItem = ref({
  name: "",
  quantity: 1,
  minimum: 1,
  alternative: "",
  observations: "",
  photos: [] as string[],
});

const addRiderItem = async () => {
  if (!newRiderItem.value.name) {
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: "Nome é obrigatório!",
      background: "#111",
      color: "#fff",
    });
    return;
  }
  await store.addRiderItem(newRiderItem.value);
  newRiderItem.value = {
    name: "",
    quantity: 1,
    minimum: 1,
    alternative: "",
    observations: "",
    photos: [],
  };
  showSuccess("Item adicionado!");
};

const removeRiderItem = (id: number) => {
  confirmAction("Remover Item?", "Essa ação não pode ser desfeita.", () =>
    store.removeRiderItem(id)
  );
};

const clearRiderItems = () => {
  confirmClear(
    "Limpar Rider?",
    "Isso removerá todos os itens do rider técnico.",
    () => store.clearRiderItems()
  );
};

// Rider Edit
const riderModalOpen = ref(false);
const editingRiderItem = ref<TechnicalRiderItem | null>(null);
const editRiderForm = ref({
  id: 0,
  name: "",
  quantity: 1,
  minimum: 1,
  alternative: "",
  observations: "",
  photos: [] as string[],
});

const openEditRiderItem = (item: TechnicalRiderItem) => {
  editingRiderItem.value = item;
  editRiderForm.value = {
    ...item,
    id: item.id || 0,
    photos: [...item.photos],
    alternative: item.alternative || "",
    observations: item.observations || "",
  };
  riderModalOpen.value = true;
};

const saveRiderItem = async () => {
  if (editingRiderItem.value) {
    await store.updateRiderItem({
      ...editRiderForm.value,
    });
    riderModalOpen.value = false;
    showSuccess("Item atualizado!");
  }
};
</script>

<template>
  <!-- Login Screen -->
  <div v-if="!isAuthenticated" class="login-overlay">
    <div class="login-box">
      <h2>Admin Login</h2>
      <form @submit.prevent="checkLogin">
        <div class="form-group">
          <label>Usuário</label>
          <input
            v-model="loginForm.username"
            type="text"
            placeholder="Username"
            required
          />
        </div>
        <div class="form-group">
          <label>Senha</label>
          <input
            v-model="loginForm.password"
            type="password"
            placeholder="Password"
            required
          />
        </div>
        <button type="submit" class="action-btn full-width">Entrar</button>
      </form>
      <router-link to="/" class="back-link">Voltar ao Site</router-link>
    </div>
  </div>

  <!-- Admin Interface -->
  <div v-else class="admin-container">
    <aside class="sidebar">
      <h2>Admin Panel</h2>
      <nav>
        <button
          :class="{ active: activeTab === 'general' }"
          @click="activeTab = 'general'"
        >
          Geral & Banners
        </button>
        <button
          :class="{ active: activeTab === 'agenda' }"
          @click="activeTab = 'agenda'"
        >
          Agenda
        </button>
        <button
          :class="{ active: activeTab === 'about' }"
          @click="activeTab = 'about'"
        >
          Sobre
        </button>
        <button
          :class="{ active: activeTab === 'members' }"
          @click="activeTab = 'members'"
        >
          Membros
        </button>
        <button
          :class="{ active: activeTab === 'merch' }"
          @click="activeTab = 'merch'"
        >
          Merchandise
        </button>
        <button
          :class="{ active: activeTab === 'gallery' }"
          @click="activeTab = 'gallery'"
        >
          Galeria
        </button>
        <button
          :class="{ active: activeTab === 'repertoire' }"
          @click="activeTab = 'repertoire'"
        >
          Repertório
        </button>
        <button
          :class="{ active: activeTab === 'rider' }"
          @click="activeTab = 'rider'"
        >
          Rider & Mapa
        </button>
        <div class="nav-divider"></div>
        <button @click="logout" class="logout-btn">Sair</button>
        <router-link to="/" class="view-site-btn">Ver Site</router-link>
      </nav>
    </aside>

    <main class="content">
      <!-- General & Banners Section -->
      <section v-if="activeTab === 'general'">
        <h3>Configurações Gerais</h3>
        <div class="form-group">
          <label>URL do Logo</label>
          <ImageUpload v-model="store.config.logoUrl" />
        </div>
        <button @click="store.updateConfig()" class="action-btn">
          Salvar Configurações
        </button>

        <h3 style="margin-top: 3rem">Banners (Carrossel)</h3>
        <div class="form-group">
          <label>Adicionar Novas Imagens</label>
          <ImageUpload v-model="newBannerUrls" :multiple="true" />
          <button
            @click="addBanner"
            class="action-btn"
            style="margin-top: 1rem"
          >
            Adicionar ao Banner
          </button>
        </div>

        <div class="banner-list">
          <div
            v-for="(img, index) in store.config.bannerImages"
            :key="index"
            class="banner-item"
          >
            <img :src="img" />
            <button @click="removeBanner(index)" class="delete-btn">X</button>
          </div>
        </div>

        <div v-if="store.config.bannerImages.length > 0" style="margin-top: 2rem;">
            <button @click="clearBanners" class="delete-all-btn">Limpar Tudo</button>
        </div>
      </section>

      <!-- Agenda Section -->
      <section v-if="activeTab === 'agenda'">
        <h3>Gerenciar Agenda</h3>
        <div class="add-form">
          <h4>Adicionar Show</h4>
          <div class="grid-2">
            <input v-model="newShow.venue" placeholder="Local / Evento" />
            <input v-model="newShow.address" placeholder="Endereço Completo" />
            <input v-model="newShow.date" type="date" />
            <input v-model="newShow.time" type="time" />
          </div>
          <input
            v-model="newShow.ticketLinks"
            placeholder="Links de Ingresso (separados por vírgula)"
            class="full-width"
          />
          <button @click="addShow" class="action-btn">Adicionar Show</button>
        </div>

        <div class="list-container">
          <div v-for="show in store.shows" :key="show.id" class="list-item">
            <div class="info">
              <strong>{{ show.date }} - {{ show.venue }}</strong>
              <small>{{ show.address }} | {{ show.time }}</small>
            </div>
            <div class="actions">
              <button @click="openEditShow(show)" class="edit-btn-text">
                Editar
              </button>
              <button @click="removeShow(show.id!)" class="delete-btn-text">
                Remover
              </button>
            </div>
          </div>
        </div>
        
        <div v-if="store.shows.length > 0" style="margin-top: 2rem;">
            <button @click="clearShows" class="delete-all-btn">Limpar Tudo</button>
        </div>
      </section>

      <!-- About Section -->
      <section v-if="activeTab === 'about'">
        <h3>Gerenciar Sobre a Banda</h3>
        <div class="form-group">
          <label
            >Texto HTML (Aceita tags &lt;b&gt;, &lt;br&gt;, &lt;span
            style="..."&gt;)</label
          >
          <textarea v-model="store.config.aboutText" rows="15"></textarea>
        </div>
        <button @click="store.updateConfig()" class="action-btn">
          Salvar Texto
        </button>

        <div class="preview-box">
          <h4>Preview:</h4>
          <div v-html="store.config.aboutText"></div>
        </div>
      </section>

      <!-- Members Section -->
      <section v-if="activeTab === 'members'">
        <h3>Gerenciar Membros</h3>
        <div class="add-form">
          <h4>Adicionar Membro</h4>
          <div class="grid-2">
            <input v-model="newMember.name" placeholder="Nome" />
            <input
              v-model="newMember.role"
              placeholder="Função (ex: Vocalista)"
            />
            <input v-model="newMember.instagram" placeholder="Instagram (@usuario)" />
          </div>
          <textarea
            v-model="newMember.description"
            placeholder="Descrição"
            rows="3"
          ></textarea>
          <label style="margin-top: 1rem; display: block; color: #aaa"
            >Fotos</label
          >
          <ImageUpload v-model="newMember.photos" :multiple="true" />
          <button @click="addMember" class="action-btn">
            Adicionar Membro
          </button>
        </div>

        <div class="members-grid-admin">
          <div
            v-for="(member, index) in store.members"
            :key="member.id"
            class="member-card-admin draggable-item"
            draggable="true"
            @dragstart="onDragStartMember(index)"
            @dragover.prevent
            @drop="onDropMember(index)"
            :class="{ dragging: draggedMemberIndex === index }"
          >
            <div class="card-image">
              <img
                :src="
                  member.photos[0] ||
                  'https://via.placeholder.com/300x400?text=No+Photo'
                "
                :alt="member.name"
              />
              <div class="drag-handle-overlay">☰</div>
            </div>
            <div class="card-content">
              <strong>{{ member.name }}</strong>
              <small>{{ member.role }}</small>
              <div class="card-actions">
                <button @click="openEditMember(member)" class="edit-btn-text">
                  Editar
                </button>
                <button
                  @click="member.id && removeMember(member.id)"
                  class="delete-btn-text"
                >
                  Remover
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="store.members.length > 0" style="margin-top: 2rem;">
            <button @click="clearMembers" class="delete-all-btn">Limpar Tudo</button>
        </div>
      </section>

      <!-- Merch Section -->
      <section v-if="activeTab === 'merch'">
        <h3>Gerenciar Merchandise</h3>
        <div class="add-form">
          <h4>Adicionar Produto</h4>
          <div class="grid-2">
            <input v-model="newProduct.name" placeholder="Nome do Produto" />
            <input
              v-model="newProduct.price"
              type="number"
              placeholder="Preço"
            />
          </div>
          <textarea
            v-model="newProduct.description"
            placeholder="Descrição"
            rows="3"
          ></textarea>
          <label style="margin-top: 1rem; display: block; color: #aaa"
            >Imagens</label
          >
          <ImageUpload v-model="newProduct.images" :multiple="true" />
          <div class="grid-2">
            <input
              v-model="newProduct.colors"
              placeholder="Cores (sep. por vírgula)"
            />
            <input
              v-model="newProduct.sizes"
              placeholder="Tamanhos (sep. por vírgula)"
            />
          </div>
          <button @click="addProduct" class="action-btn">
            Adicionar Produto
          </button>
        </div>

        <div class="list-container">
          <div
            v-for="product in store.products"
            :key="product.id"
            class="list-item"
          >
            <div class="info">
              <strong>{{ product.name }}</strong> - R$ {{ product.price }}
            </div>
            <div class="actions">
              <button @click="openEditProduct(product)" class="edit-btn-text">
                Editar
              </button>
              <button
                @click="product.id && removeProduct(product.id)"
                class="delete-btn-text"
              >
                Remover
              </button>
            </div>
          </div>
        </div>

        <div v-if="store.products.length > 0" style="margin-top: 2rem;">
            <button @click="clearProducts" class="delete-all-btn">Limpar Tudo</button>
        </div>
      </section>

      <!-- Gallery Section -->
      <section v-if="activeTab === 'gallery'">
        <h3>Gerenciar Galeria</h3>
        <div class="add-form">
          <h4>Novo Álbum</h4>
          <div class="form-group">
            <input v-model="newAlbum.title" placeholder="Título do Álbum" />
          </div>
          <div class="form-group">
            <textarea
              v-model="newAlbum.description"
              placeholder="Descrição"
              rows="2"
            ></textarea>
          </div>
          <div class="form-group">
            <label>Capa do Álbum</label>
            <ImageUpload v-model="newAlbum.cover_url" />
          </div>
          <button @click="addAlbum" class="action-btn">Criar Álbum</button>
        </div>

        <div class="list-container">
          <div
            v-for="album in store.albums"
            :key="album.id"
            class="album-block"
          >
            <div class="list-item">
              <div class="info">
                <strong>{{ album.title }}</strong>
                <small>{{ album.photos?.length || 0 }} fotos</small>
              </div>
              <div class="actions">
                <button @click="openEditAlbum(album)" class="edit-btn-text">
                  Editar
                </button>
                <button @click="deleteAlbum(album.id)" class="delete-btn-text">
                  Excluir
                </button>
              </div>
            </div>

            <!-- Photos Management inside Album -->
            <div class="album-photos-manager">
              <h5>Fotos do Álbum</h5>
              <div class="form-group">
                <ImageUpload v-model="newAlbumPhotos" :multiple="true" />
                <button
                  @click="addPhotosToAlbum(album.id)"
                  class="action-btn small-btn"
                >
                  Adicionar Fotos
                </button>
              </div>
              <div class="photos-grid">
                <div
                  v-for="(photo, index) in album.photos"
                  :key="photo.id"
                  class="photo-item draggable-photo"
                  draggable="true"
                  @dragstart="onDragStartPhoto(index, album.id)"
                  @dragover.prevent
                  @drop="onDropPhoto(index, album.id)"
                  :class="{
                    dragging:
                      draggedPhotoIndex === index &&
                      draggedPhotoAlbumId === album.id,
                  }"
                >
                  <img :src="photo.url" />
                  <button
                    @click="removePhoto(photo.id, album.id)"
                    class="delete-photo-btn"
                  >
                    X
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="store.albums.length > 0" style="margin-top: 2rem;">
            <button @click="clearAlbums" class="delete-all-btn">Limpar Tudo</button>
        </div>
      </section>

      <!-- Repertoire Section -->
      <section v-if="activeTab === 'repertoire'">
        <h3>Gerenciar Repertório</h3>
        <div class="add-form">
          <h4>Adicionar Música</h4>
          <div class="form-group">
            <input v-model="newSong.title" placeholder="Título da Música" />
          </div>
          <div class="form-group">
            <input
              v-model="newSong.url"
              placeholder="URL para ouvir (YouTube, Spotify, etc)"
            />
          </div>
          <button @click="addSong" class="action-btn">Adicionar Música</button>
        </div>

        <div class="list-container">
          <div v-for="song in store.songs" :key="song.id" class="list-item">
            <div class="info">
              <strong>{{ song.title }}</strong>
              <small
                ><a :href="song.url" target="_blank">{{ song.url }}</a></small
              >
            </div>
            <div class="actions">
              <button @click="removeSong(song.id!)" class="delete-btn-text">
                Remover
              </button>
            </div>
          </div>
        </div>

        <div v-if="store.songs.length > 0" style="margin-top: 2rem;">
            <button @click="clearSongs" class="delete-all-btn">Limpar Tudo</button>
        </div>
      </section>

      <!-- Rider & Map Section -->
      <section v-if="activeTab === 'rider'">
        <h3>Mapa de Palco</h3>
        <div class="form-group">
          <label>Imagem do Mapa de Palco</label>
          <ImageUpload v-model="store.config.stageMapUrl" />
          <button
            @click="store.updateConfig()"
            class="action-btn"
            style="margin-top: 1rem"
          >
            Salvar Mapa
          </button>
        </div>

        <h3 style="margin-top: 3rem">Technical Rider</h3>
        <div class="add-form">
          <h4>Adicionar Equipamento</h4>
          <div class="grid-2">
            <input v-model="newRiderItem.name" placeholder="Nome do Equipamento" />
            <input
              v-model="newRiderItem.quantity"
              type="number"
              placeholder="Quantidade"
            />
            <input
              v-model="newRiderItem.minimum"
              type="number"
              placeholder="Mínimo"
            />
            <input
              v-model="newRiderItem.alternative"
              placeholder="Alternativa"
            />
          </div>
          <textarea
            v-model="newRiderItem.observations"
            placeholder="Observações"
            rows="2"
          ></textarea>
          <label style="margin-top: 1rem; display: block; color: #aaa"
            >Fotos do Equipamento</label
          >
          <ImageUpload v-model="newRiderItem.photos" :multiple="true" />
          <button @click="addRiderItem" class="action-btn">
            Adicionar Item
          </button>
        </div>

        <div class="list-container">
          <div
            v-for="item in store.technicalRider"
            :key="item.id"
            class="list-item"
          >
            <div class="info">
              <strong>{{ item.name }}</strong> (Qtd: {{ item.quantity }})
              <div v-if="item.observations" style="font-size: 0.8rem; color: #aaa">
                Obs: {{ item.observations }}
              </div>
            </div>
            <div class="actions">
              <button @click="openEditRiderItem(item)" class="edit-btn-text">
                Editar
              </button>
              <button
                @click="item.id && removeRiderItem(item.id)"
                class="delete-btn-text"
              >
                Remover
              </button>
            </div>
          </div>
        </div>

        <div v-if="store.technicalRider.length > 0" style="margin-top: 2rem;">
            <button @click="clearRiderItems" class="delete-all-btn">Limpar Tudo</button>
        </div>
      </section>
    </main>

    <!-- Modals -->
    <BaseModal
      :is-open="showModalOpen"
      title="Editar Show"
      @close="showModalOpen = false"
      @save="saveShow"
    >
      <div class="form-group">
        <label>Local / Evento</label>
        <input v-model="editShowForm.venue" />
      </div>
      <div class="form-group">
        <label>Endereço</label>
        <input v-model="editShowForm.address" />
      </div>
      <div class="grid-2">
        <div class="form-group">
          <label>Data</label>
          <input v-model="editShowForm.date" type="date" />
        </div>
        <div class="form-group">
          <label>Hora</label>
          <input v-model="editShowForm.time" type="time" />
        </div>
      </div>
      <div class="form-group">
        <label>Links de Ingressos</label>
        <input
          v-model="editShowForm.ticketLinks"
          placeholder="Links separados por vírgula"
        />
      </div>
    </BaseModal>

    <BaseModal
      :is-open="memberModalOpen"
      title="Editar Membro"
      @close="memberModalOpen = false"
      @save="saveMember"
    >
      <div class="form-group">
        <label>Nome</label>
        <input v-model="editMemberForm.name" />
      </div>
      <div class="form-group">
        <label>Função</label>
        <input v-model="editMemberForm.role" />
      </div>
      <div class="form-group">
        <label>Descrição</label>
        <textarea v-model="editMemberForm.description" rows="3"></textarea>
      </div>
      <div class="form-group">
        <label>Instagram</label>
        <input v-model="editMemberForm.instagram" placeholder="@usuario" />
      </div>
      <div class="form-group">
        <label>Fotos</label>
        <ImageUpload v-model="editMemberForm.photos" :multiple="true" />
      </div>
    </BaseModal>

    <BaseModal
      :is-open="productModalOpen"
      title="Editar Produto"
      @close="productModalOpen = false"
      @save="saveProduct"
    >
      <div class="grid-2">
        <div class="form-group">
          <label>Nome</label>
          <input v-model="editProductForm.name" />
        </div>
        <div class="form-group">
          <label>Preço</label>
          <input v-model="editProductForm.price" type="number" />
        </div>
      </div>
      <div class="form-group">
        <label>Descrição</label>
        <textarea v-model="editProductForm.description" rows="3"></textarea>
      </div>
      <div class="form-group">
        <label>Imagens</label>
        <ImageUpload v-model="editProductForm.images" :multiple="true" />
      </div>
      <div class="grid-2">
        <div class="form-group">
          <label>Cores</label>
          <input v-model="editProductForm.colors" />
        </div>
        <div class="form-group">
          <label>Tamanhos</label>
          <input v-model="editProductForm.sizes" />
        </div>
      </div>
    </BaseModal>

    <BaseModal
      :is-open="albumModalOpen"
      title="Editar Álbum"
      @close="albumModalOpen = false"
      @save="saveAlbum"
    >
      <div class="form-group">
        <label>Título</label>
        <input v-model="editAlbumForm.title" />
      </div>
      <div class="form-group">
        <label>Descrição</label>
        <textarea v-model="editAlbumForm.description" rows="3"></textarea>
      </div>
      <div class="form-group">
        <label>Capa</label>
        <ImageUpload v-model="editAlbumForm.cover_url" />
      </div>
    </BaseModal>

    <BaseModal
      :is-open="riderModalOpen"
      title="Editar Item do Rider"
      @close="riderModalOpen = false"
      @save="saveRiderItem"
    >
      <div class="form-group">
        <label>Nome</label>
        <input v-model="editRiderForm.name" />
      </div>
      <div class="grid-2">
        <div class="form-group">
          <label>Quantidade</label>
          <input v-model="editRiderForm.quantity" type="number" />
        </div>
        <div class="form-group">
          <label>Mínimo</label>
          <input v-model="editRiderForm.minimum" type="number" />
        </div>
      </div>
      <div class="form-group">
        <label>Alternativa</label>
        <input v-model="editRiderForm.alternative" />
      </div>
      <div class="form-group">
        <label>Observações</label>
        <textarea v-model="editRiderForm.observations" rows="2"></textarea>
      </div>
      <div class="form-group">
        <label>Fotos</label>
        <ImageUpload v-model="editRiderForm.photos" :multiple="true" />
      </div>
    </BaseModal>
  </div>
</template>

<style scoped>
.admin-container {
  display: flex;
  min-height: 100vh;
  background: #111;
  color: #eee;
}

.sidebar {
  width: 250px;
  background: #000;
  padding: 2rem;
  border-right: 1px solid #333;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
}

.sidebar h2 {
  color: var(--color-primary);
  margin-bottom: 2rem;
}

.sidebar nav button {
  display: block;
  width: 100%;
  text-align: left;
  padding: 1rem;
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  transition: 0.2s;
  font-size: 1rem;
}

.sidebar nav button:hover,
.sidebar nav button.active {
  color: #fff;
  background: #222;
  border-left: 3px solid var(--color-primary);
}

.view-site-btn {
  display: block;
  margin-top: 2rem;
  padding: 1rem;
  text-align: center;
  background: #333;
  color: #fff;
  border-radius: 4px;
  text-decoration: none;
}

.content {
  flex: 1;
  padding: 3rem;
  margin-left: 250px; /* Offset for fixed sidebar */
}

h3 {
  border-bottom: 1px solid #333;
  padding-bottom: 0.5rem;
  margin-bottom: 2rem;
  color: var(--color-primary);
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #aaa;
  font-size: 0.9rem;
}

input,
textarea {
  width: 100%;
  padding: 0.8rem;
  background: #222;
  border: 1px solid #444;
  color: #fff;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.input-group {
  display: flex;
  gap: 1rem;
}

.input-group button {
  padding: 0 1.5rem;
  background: var(--color-primary);
  border: none;
  color: #fff;
  cursor: pointer;
  border-radius: 4px;
}

.preview-logo {
  max-width: 200px;
  margin-top: 1rem;
  border: 1px solid #444;
}

.banner-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.banner-item {
  position: relative;
}

.banner-item img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
}

.delete-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.8);
  color: red;
  border: none;
  width: 24px;
  height: 24px;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Add Forms */
.add-form {
  background: #1a1a1a;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  border: 1px solid #333;
}

.add-form h4 {
  margin-bottom: 1rem;
  color: #ccc;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.full-width {
  width: 100%;
}

.action-btn {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 1rem;
}

.action-btn:hover {
  background: #a00;
}

/* List Items */
.list-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.list-item {
  background: #222;
  padding: 1rem;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 3px solid #444;
}

.list-item .info strong {
  display: block;
  color: #fff;
}

.list-item .info small {
  color: #888;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.delete-btn-text {
  background: transparent;
  color: #ff4444;
  border: 1px solid #ff4444;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: 0.2s;
}

.delete-btn-text:hover {
  background: #ff4444;
  color: white;
}

.edit-btn-text {
  background: transparent;
  color: #44aaff;
  border: 1px solid #44aaff;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: 0.2s;
}

.edit-btn-text:hover {
  background: #44aaff;
  color: white;
}

.preview-box {
  background: #fff;
  color: #000;
  padding: 1rem;
  border-radius: 4px;
  margin-top: 1rem;
}

.album-block {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.album-photos-manager {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #333;
}

.album-photos-manager h5 {
  color: #aaa;
  margin-bottom: 0.5rem;
}

.small-btn {
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  margin-top: 0.5rem;
}

.photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.5rem;
  margin-top: 1rem;
}

.photo-item {
  position: relative;
  height: 100px;
}

/* Drag and Drop Styles */
.draggable-item {
  cursor: grab;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.draggable-item.dragging {
  opacity: 0.5;
  background: #333;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.drag-handle {
  margin-right: 1rem;
  cursor: grab;
  color: #666;
  font-size: 1.2rem;
}

/* Members Admin Grid */
.members-grid-admin {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.member-card-admin {
  background: #222;
  border: 1px solid #333;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.member-card-admin .card-image {
  height: 250px;
  position: relative;
  background: #000;
}

.member-card-admin .card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.drag-handle-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: grab;
}

.member-card-admin .card-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.member-card-admin .card-content strong {
  font-size: 1.1rem;
  color: #fff;
}

.member-card-admin .card-content small {
  color: var(--color-primary);
  text-transform: uppercase;
  font-size: 0.8rem;
}

.member-card-admin .card-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.member-card-admin .card-actions button {
  flex: 1;
  font-size: 0.8rem;
  padding: 0.4rem;
}

.draggable-photo {
  cursor: grab;
  transition: transform 0.2s;
}

.draggable-photo.dragging {
  opacity: 0.5;
  transform: scale(0.9);
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.delete-photo-btn {
  position: absolute;
  top: 2px;
  right: 2px;
  background: rgba(255, 0, 0, 0.8);
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
}

/* Login Styles */
.login-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.login-box {
  background: #111;
  padding: 3rem;
  border-radius: 8px;
  border: 1px solid #333;
  width: 100%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 0 30px rgba(138, 3, 3, 0.2);
}

.login-box h2 {
  font-family: var(--font-display);
  color: var(--color-primary);
  margin-bottom: 2rem;
  font-size: 2rem;
}

.back-link {
  display: block;
  margin-top: 1.5rem;
  color: #666;
  text-decoration: none;
  font-size: 0.9rem;
}

.back-link:hover {
  color: #fff;
}

.nav-divider {
  height: 1px;
  background: #333;
  margin: 1rem 0;
}

.logout-btn {
  background: transparent;
  border: 1px solid #444;
  color: #aaa;
  width: 100%;
  padding: 0.8rem;
  cursor: pointer;
  text-align: left;
  transition: 0.3s;
  margin-bottom: 0.5rem;
}

.logout-btn:hover {
  background: #222;
  color: #fff;
  border-color: #666;
}

.delete-all-btn {
  background: #d32f2f;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
  transition: 0.3s;
}

.delete-all-btn:hover {
  background: #b71c1c;
}
</style>
