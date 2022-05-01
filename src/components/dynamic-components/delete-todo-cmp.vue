<template>
  <section class="delete-todo-modal" :style="position">
    <div class="delete-header">
      <span>Item actions</span>
      <icon-base iconName="xs" @click="close" />
    </div>

    <div>
      <button class="convert-btn" @click="convertToCard">Convert to card</button>
      <button @click="deleteTodo">Delete</button>
    </div>
  </section>
</template>

<script>
import iconBase from '../icon-base.vue';

export default {
  props: {
    todo: {
      type: Object,
      required: true,
    },
    pos: {
      type: Object,
      required: false,
    },
  },
  methods: {
    deleteTodo() {
      this.$emit('remove', this.todo.id);
    },
    convertToCard() {},
    close() {
      this.$emit('close');
    },
  },
  computed: {
    position() {
      return this.pos ? { right: this.pos.right + 'px', top: this.pos.top + 'px' } : { right: -279 + 'px', top: 39 + 'px' };
    },
  },
  components: {
    iconBase,
  },
};
</script>

<style></style>
