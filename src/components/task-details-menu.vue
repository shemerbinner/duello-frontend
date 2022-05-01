<template>
  <section class="task-details-menu">
    <div class="task-menu">
      <div v-if="!isMember" class="task-menu-group">
        <h2>Suggested</h2>
        <button @click="joinTask"><icon-base class="icon-fill" iconName="member" />Join</button>
      </div>

      <div class="task-menu-group">
        <h2>Add to card</h2>
        <button @click="openModal('member-cmp')"><icon-base class="icon-color" iconName="member" />Members</button>
        <button @click="openModal('label-cmp')"><icon-base class="icon-color" iconName="label" />Labels</button>
        <button @click="openModal('checklist-cmp')">
          <icon-base class="icon-color" iconName="checklist" />Checklist
        </button>
        <button @click="openModal('calendar-cmp')"><icon-base class="icon-color" iconName="clock" />Dates</button>
        <button @click="openModal('attachment-cmp')">
          <icon-base class="icon-color attach-icon" iconName="attachment" />Attachment
        </button>
        <button @click="openModal('cover-cmp')"><icon-base class="icon-fill" iconName="cover" />Cover</button>
      </div>
      <div class="task-menu-group">
        <h2>Power-Ups</h2>
        <button @click="openModal('giphy-cmp')">
          <icon-base class="icon-color attach-icon" iconName="giphy" />Giphy
        </button>
      </div>

      <div class="task-menu-group">
        <h2>Actions</h2>
        <button @click="openModal('copy-cmp')"><icon-base class="icon-fill" iconName="copy" />Copy</button>
        <button @click="removeTask"><icon-base class="icon-fill" iconName="archive" />Archive</button>
      </div>
    </div>
  </section>
</template>

<script>
import iconBase from './icon-base.vue';
export default {
  props: {
    isMember: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    openModal(type) {
      this.$emit('openModal', type);
    },
    joinTask() {
      this.$emit('joinTask');
    },
    removeTask() {
      this.$emit('removeTask');
    },
  },
  components: { iconBase },
};
</script>
