<template>
  <section class="activity-menu main-container">
    <div class="controls">
      <a :class="{ 'control-item': true, 'is-active': isAll }" @click="changeList">All</a>
      <a :class="{ 'control-item': true, 'is-active': isComments }" @click="changeList">Comments</a>
    </div>

    <div class="activity-list">
      <div v-for="content in list" :key="content.id">
        <component :is="content.type" :comment="content" :info="content" :isMenu="true" />
      </div>
    </div>
  </section>
</template>

<script>
import commentCmp from '../comment-cmp.vue';
import activityCmp from '../dynamic-components/activity-cmp.vue';

export default {
  props: {
    list: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      isAll: true,
      isComments: false,
    };
  },
  methods: {
    changeList() {
      this.isAll = !this.isAll;
      this.isComments = !this.isComments;

      this.$emit('change');
    },
  },
  components: { commentCmp, activityCmp },
};
</script>

<style></style>
