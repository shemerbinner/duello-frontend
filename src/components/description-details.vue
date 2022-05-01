<template>
  <section class="description">
    <div class="header">
      <!-- <img src="../assets/icons/align-left.svg" /> -->
      <icon-base class="description-icon" iconName="description"></icon-base>
      <h3>Description</h3>
    </div>
    <div class="description-content">
      <div class="fake-textarea" v-if="!addDescription && !task.description" @click="addDesc">
        Add a more detailed description...
      </div>
      <div class="fake-textarea description" v-else-if="!addDescription && task.description" @click="addDesc">
        {{ task.description }}
      </div>

      <div class="real-textarea" v-else>
        <resizable-textarea
          placeholder="Add a more detailed description..."
          focusOut="saveDesc"
          :value="task.description"
          @valueChange="onDescriptionChanged"
          :autofocus="true"
        />

        <div class="actions">
          <button class="save-description" @click="saveDesc">Save</button>
          <button class="close-btn">
            <img src="../assets/icons/x.svg" alt="close" @click="addDescription = !addDescription" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import iconBase from './icon-base.vue';
import resizableTextarea from './resizable-textarea.vue';
export default {
  components: { iconBase, resizableTextarea },
  props: {
    taskToEdit: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      addDescription: false,
      task: this.taskToEdit,
    };
  },
  created() {
    socketService.on('loading', (task) => {
      this.task = task;
    });
  },
  methods: {
    onDescriptionChanged(value) {
      this.task.description = value;
    },
    addDesc() {
      this.addDescription = !this.addDescription;
    },
    saveDesc() {
      this.$emit('save', { ...this.task });
      this.addDescription = !this.addDescription;
    },
  },
};
</script>
