<template>
  <section :class="[{ open: addedGroup }, 'group add-group', txtClr]">
    <div class="add-group-content" @click="showForm">
      <icon-base class="plus-btn" iconName="Plus"></icon-base>
      <span>Add another list</span>
    </div>

    <form class="add-group-form" @submit.prevent="addGroup">
      <div class="input-container">
        <input
          ref="input"
          type="text"
          placeholder="Enter list title..."
          v-model="title"
          @blur="addedGroup = !addedGroup"
        />
      </div>
      <div class="add-group-btns">
        <button @mousedown="addGroup" @touchstart="addGroup" type="button">Add list</button>
        <button @click="addedGroup = !addedGroup">
          <img src="../assets/icons/x.svg" alt="close form" />
        </button>
      </div>
    </form>
  </section>
</template>

<script>
import iconBase from './icon-base.vue';
export default {
  data() {
    return {
      addedGroup: false,
      title: '',
    };
  },
  methods: {
    addGroup(e) {
      if (!this.title) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      this.$emit('addGroup', this.title);

      this.title = '';
    },
    showForm() {
      this.title = '';
      this.addedGroup = true;
    },
  },
  components: { iconBase },
  updated() {
    if (this.addedGroup) {
      this.$refs.input.focus();
    }
  },
  computed: {
    txtClr() {
      if (this.$store.getters.isDark) return 'light-bcg';
    },
  },
};
</script>
