<script setup lang="ts">
import { ref } from "vue";
import { useBandStore, type Product } from "../stores/bandStore";
import BaseModal from "./BaseModal.vue";

const store = useBandStore();

// Purchase Modal Logic
const purchaseModalOpen = ref(false);
const selectedProduct = ref<Product | null>(null);
const purchaseForm = ref({
  size: "",
  color: "",
  quantity: 1,
});

const openPurchaseModal = (product: Product) => {
  selectedProduct.value = product;
  purchaseForm.value = {
    size: product.sizes?.[0] || "",
    color: product.colors?.[0] || "",
    quantity: 1,
  };
  purchaseModalOpen.value = true;
};

const confirmPurchase = () => {
  if (!selectedProduct.value) return;

  const { size, color, quantity } = purchaseForm.value;
  const product = selectedProduct.value.name;

  const message = `Olá! Tenho interesse em comprar *${quantity}x ${product}* (${color ? color + ", " : ""}Tamanho: ${size}).`;
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/5514996828384?text=${encodedMessage}`;

  window.open(whatsappUrl, "_blank");
  purchaseModalOpen.value = false;
};
</script>

<template>
  <section id="merch" class="section-light">
    <div class="container">
      <h2 class="section-title">{{ $t("merch.title") }}</h2>

      <div class="products-grid">
        <div
          v-for="product in store.products"
          :key="product.id"
          class="product-card"
        >
          <div class="product-image">
            <img
              :src="
                product.images[0] ||
                'https://via.placeholder.com/300?text=No+Image'
              "
              :alt="product.name"
            />
            <div class="price-tag">R$ {{ product.price.toFixed(2) }}</div>
          </div>
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p>{{ product.description }}</p>
            <div class="options" v-if="product.sizes.length">
              <span>Tamanhos:</span>
              <div class="tags">
                <span v-for="size in product.sizes" :key="size" class="tag">{{
                  size
                }}</span>
              </div>
            </div>
            <button class="buy-btn" @click="openPurchaseModal(product)">
              {{ $t("merch.buy") }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Purchase Modal -->
    <BaseModal
      :is-open="purchaseModalOpen"
      :title="selectedProduct?.name || 'Comprar'"
      @close="purchaseModalOpen = false"
      @save="confirmPurchase"
    >
      <div class="purchase-form" v-if="selectedProduct">
        <div class="product-summary">
          <img :src="selectedProduct.images[0]" class="modal-thumb" />
          <div>
            <p class="modal-price">R$ {{ selectedProduct.price.toFixed(2) }}</p>
            <p class="modal-desc">{{ selectedProduct.description }}</p>
          </div>
        </div>

        <div class="form-group" v-if="selectedProduct.sizes?.length">
          <label>Tamanho:</label>
          <select v-model="purchaseForm.size">
            <option
              v-for="size in selectedProduct.sizes"
              :key="size"
              :value="size"
            >
              {{ size }}
            </option>
          </select>
        </div>

        <div class="form-group" v-if="selectedProduct.colors?.length">
          <label>Cor:</label>
          <select v-model="purchaseForm.color">
            <option
              v-for="color in selectedProduct.colors"
              :key="color"
              :value="color"
            >
              {{ color }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Quantidade:</label>
          <input
            type="number"
            v-model="purchaseForm.quantity"
            min="1"
            max="10"
          />
        </div>

        <p class="whatsapp-note">
          <small
            >Ao confirmar, você será redirecionado para o WhatsApp para
            finalizar o pedido.</small
          >
        </p>
      </div>
      <template #footer>
        <button class="cancel-btn" @click="purchaseModalOpen = false">
          Cancelar
        </button>
        <button class="confirm-btn" @click="confirmPurchase">
          Confirmar no WhatsApp
        </button>
      </template>
    </BaseModal>
  </section>
</template>

<style scoped>
.section-light {
  background: #151515;
  padding: 5rem 0;
}

.section-title {
  font-family: var(--font-display);
  font-size: 3rem;
  color: #fff;
  text-align: center;
  margin-bottom: 4rem;
  text-transform: uppercase;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(200px, 1fr)
  ); /* Smaller cards */
  gap: 1.5rem;
  justify-items: start; /* Align to left */
}

.product-card {
  background: #222;
  border-radius: 8px;
  overflow: hidden;
  transition: 0.3s;
  width: 100%;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
}

.product-image {
  position: relative;
  height: 200px; /* Reduced height */
  background: #fff;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.price-tag {
  position: absolute;
  top: 10px;
  right: 10px;
  background: var(--color-primary);
  color: #fff;
  padding: 0.3rem 0.8rem;
  font-weight: bold;
  border-radius: 4px;
  font-size: 0.9rem;
}

.product-info {
  padding: 1rem;
}

.product-info h3 {
  color: #fff;
  font-size: 1.1rem;
  margin-bottom: 0.3rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-info p {
  color: #aaa;
  font-size: 0.8rem;
  margin-bottom: 0.8rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.options {
  margin-bottom: 0.8rem;
}

.options span {
  color: #888;
  font-size: 0.7rem;
  display: block;
  margin-bottom: 0.2rem;
}

.tags {
  display: flex;
  gap: 0.3rem;
  flex-wrap: wrap;
}

.tag {
  background: #333;
  color: #fff;
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
  font-size: 0.7rem;
}

.buy-btn {
  width: 100%;
  background: transparent;
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  padding: 0.6rem;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  transition: 0.3s;
  font-size: 0.9rem;
}

.buy-btn:hover {
  background: var(--color-primary);
  color: #fff;
}

/* Modal Styles */
.purchase-form {
  color: #fff;
}

.product-summary {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  background: #222;
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid #333;
}

.modal-thumb {
  width: 80px;
  height: 80px;
  object-fit: contain;
  background: #fff;
  border-radius: 4px;
}

.modal-price {
  font-weight: bold;
  font-size: 1.2rem;
  color: var(--color-primary);
}

.modal-desc {
  font-size: 0.9rem;
  color: #aaa;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.3rem;
  font-weight: bold;
  font-size: 0.9rem;
  color: #ddd;
}

.form-group select,
.form-group input {
  width: 100%;
  padding: 0.5rem;
  background: #111;
  border: 1px solid #444;
  border-radius: 4px;
  color: #fff;
}

.form-group select:focus,
.form-group input:focus {
  border-color: var(--color-primary);
  outline: none;
}

.whatsapp-note {
  margin-top: 1.5rem;
  text-align: center;
  color: #888;
  font-style: italic;
}

.cancel-btn {
  background: transparent;
  border: 1px solid #444;
  color: #ccc;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 1rem;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  border-color: #666;
  color: #fff;
}

.confirm-btn {
  background: #25d366; /* WhatsApp Green */
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.confirm-btn:hover {
  background: #128c7e;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2.5rem;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }

  .product-image {
    height: 150px;
  }

  .product-summary {
    flex-direction: column;
    text-align: center;
  }

  .modal-thumb {
    margin: 0 auto;
  }
}
</style>
