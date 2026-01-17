<template>
  <div class="popup-backdrop" @click.self="$emit('close')">
    <div class="popup-modal" role="dialog" aria-modal="true">
      <header class="popup-header">
        <slot name="title">
          <h2 class="popup-title">Info</h2>
        </slot>

        <button class="popup-x" type="button" @click="$emit('close')" aria-label="Fermer">
          ✕
        </button>
      </header>

      <div class="popup-content">
        <slot />
      </div>

      <footer class="popup-actions">
        <slot name="actions">
          <button class="popup-btn ghost" type="button" @click="$emit('close')">Fermer</button>
        </slot>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["close"],
};
</script>

<style scoped>
/* ✅ Toujours au-dessus */
.popup-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 99999;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 16px;
}

/* ✅ La fenêtre visible */
.popup-modal {
  background: #111827;
  color: #ffffff;
  width: min(460px, 95vw);

  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 14px;
  padding: 16px;

  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.45);

  /* important : pas transparent */
  opacity: 1;
}

.popup-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.popup-title {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
}

.popup-x {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  font-size: 18px;
  padding: 6px 8px;
}

.popup-content {
  margin-top: 12px;
  color: rgba(255, 255, 255, 0.9);
}

.popup-actions {
  margin-top: 14px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.popup-btn {
  padding: 10px 12px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 700;
}

.popup-btn.primary {
  background: #22c55e;
  color: #0b1220;
}

.popup-btn.ghost {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: white;
}
</style>