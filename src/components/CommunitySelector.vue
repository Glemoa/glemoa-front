<template>
  <div class="community-selector-modal" v-if="show">
    <div class="modal-content">
      <div class="modal-header">
        <h2>커뮤니티 선택</h2>
        <button @click="close" class="close-btn">&times;</button>
      </div>
      <div class="community-list">
        <label v-for="community in allCommunities" :key="community" class="community-item">
          <input type="checkbox" :value="community" v-model="selected" />
          <span>{{ community }}</span>
        </label>
      </div>
      <div class="modal-footer">
        <button @click="save" class="save-btn">저장</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CommunitySelector",
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      allCommunities: ["fmkorea", "dcinside", "humoruniv", "Etoland", "clien", "ppomppu", "inven", "bobaedream", "ruliweb", "mlbpark", "theqoo", "natepann", "arcalive"],
      selected: [],
    };
  },
  watch: {
    show(newVal) {
      if (newVal) {
        const savedCommunities = localStorage.getItem("selectedCommunities");
        if (savedCommunities) {
          this.selected = JSON.parse(savedCommunities);
        } else {
          this.selected = [...this.allCommunities];
        }
      }
    },
  },
  methods: {
    save() {
      localStorage.setItem("selectedCommunities", JSON.stringify(this.selected));
      this.$emit("selection-changed", this.selected);
      this.close();
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.community-selector-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--bg-primary);
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25em;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  color: var(--text-primary);
}

.community-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
  max-height: 400px;
  overflow-y: auto;
}

.community-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.community-item:hover {
  background-color: var(--bg-secondary);
}

.community-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 10px;
  border-top: 1px solid var(--border-color);
}

.save-btn {
  background-color: var(--link-active-color);
  color: var(--button-text);
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
}
</style>
