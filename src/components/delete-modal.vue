<template>
  <section class="delete-modal">
    <div class="delete-confirmation-modal" :style="{ top: pos.top + 'px', right: pos.right + 'px' }">
      <div class="delete-header">
        <span>Delete {{ element }}?</span>

        <icon-base iconName="xs" @click="close" />
      </div>

      <div>
        <p>Deleting a {{ element }} is permanent and there is no way to get it back.</p>
        <button @click="remove">Delete {{ element }}</button>
      </div>
    </div>
  </section>
</template>

<script>
import iconBase from './icon-base.vue';

export default {
  props: {
    id: {
      type: String,
      required: false,
    },
    element: {
      type: String,
      required: true,
    },
    pos: {
      type: Object,
      required: true,
    },
  },
  methods: {
    remove() {
      this.$emit('remove', this.id);
    },
    close() {
      this.$emit('close');
    },
  },
  components: { iconBase },
};
</script>
