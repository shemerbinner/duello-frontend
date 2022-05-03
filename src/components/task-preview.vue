<template>
  <section class="task-preview" v-if="task">
    <div v-if="!isCoverBcg" class="task-labels">
      <div
        class="task-label"
        v-for="label in labels"
        :key="label.id"
        :style="'background-color:' + label.color"
        :class="labelsExpanded ? 'expand' : 'shrink'"
        @click="toggleLabelsExpand"
      >
        <span :class="labelsExpanded ? 'show' : 'hide'">{{ label.title }}&nbsp;</span>
      </div>
    </div>
    <div>
      <resizable-textarea
        class="isEditing"
        :value="taskToEditPartial.title"
        @valueChange="saveEdit"
        v-if="canEditTitle"
        :autofocus="true"
      />
      <resizable-textarea v-else :value="taskTitle" :disabled="true" />

      <div v-if="!isCoverBcg" class="task-extras">
        <div class="left">
          <span v-if="task.dueDate" :class="['due-date', isDuePassed, isDueCompleted]">
            <icon-base class="due-icon-clock" iconName="clock" />
            <icon-base class="due-icon-checked" @click.stop="isDueComplete = !isDueComplete" iconName="checked" />
            <icon-base class="due-icon-unchecked" @click.stop="isDueComplete = !isDueComplete" iconName="unchecked" />
            {{ formatDate(this.task.dueDate) }}
          </span>
          <span v-if="numberOfAttachments > 0" class="number-of-attachments">
            <icon-base iconName="attachment" />
            {{ numberOfAttachments }}
          </span>
          <span v-if="task.description" class="description-display">
            <icon-base iconName="description" />
          </span>
          <span v-if="numberOfComments > 0" class="comment-display">
            <icon-base iconName="comment" />
            {{ numberOfComments }}
          </span>
          <div
            :class="{ 'checklist-display': true, done: isChecklistDone }"
            v-if="
              this.task.checklist &&
              this.task.checklist.length &&
              this.task.checklist[0].todos &&
              this.task.checklist[0].todos.length
            "
          >
            <icon-base iconName="checklist" />
            <span>{{ checklistStatus }}</span>
          </div>
        </div>
      </div>
      <div v-if="!isCoverBcg" class="member-list">
        <img v-for="member in task.members" :key="member._id" :src="member.imgUrl" />
      </div>
    </div>
  </section>
</template>

<script>
import { isBefore } from 'date-fns';
import iconBase from './icon-base.vue';
import resizableTextarea from './resizable-textarea.vue';

export default {
  props: {
    task: {
      type: Object,
      required: true,
    },
    canEditTitle: {
      type: Boolean,
      required: false,
    },
  },

  data() {
    return {
      taskToEditPartial: { title: this.task.title, id: this.task.id },
      taskCover: null,
      isDueComplete: false,
      dueStatus: null,
      taskTitle: this.task.title,
    };
  },
  methods: {
    formatDate() {
      const date = new Date(this.task.dueDate);
      const now = Date.now();

      const isPassed = isBefore(date, now);
      if (!isPassed) {
        const diff = +date - now;
        if (diff < 86400000 && diff > 0) {
          this.dueStatus = 'is-due-soon';
        } else this.dueStatus = '';
      } else this.dueStatus = 'is-due-past';

      return date.toLocaleString('default', {
        month: 'short',
        day: 'numeric',
      });
    },
    toggleLabelsExpand(e) {
      e.stopPropagation();
      this.$emit('toggleLabelsExpanded');
    },
    async saveEdit(txt) {
      this.taskToEditPartial.title = txt;
      this.$emit('editTask', this.taskToEditPartial);
    },
  },
  computed: {
    numberOfAttachments() {
      return this.task.attachments.length;
    },
    numberOfComments() {
      return this.task.comments.length;
    },
    labelsExpanded() {
      return this.$store.getters.labelsExpanded;
    },
    labels() {
      return this.$store.getters.boardLabels.filter((label) => {
        if (!this.task.labelIds) return false;
        return this.task.labelIds.includes(label.id);
      });
    },
    isCover() {
      if (!this.task.style.cover.type) return false;
      return true;
    },
    coverStyle() {
      if (this.task.style.cover.type === 'color') {
        return `background-color: ${this.task.style.cover.color}; height: 32px`;
      } else return '';
    },
    isCoverBcg() {
      if (this.task.style.cover.style === 'background') return true;
      else return false;
    },
    checklistStatus() {
      if (!this.task.checklist || !this.task.checklist.length) return;
      const length = this.task.checklist[0].todos.length;
      if (!this.task.checklist[0].todos || !length) {
        var done = [];
      } else done = this.task.checklist[0].todos.filter((todo) => todo.isDone);
      return `${done.length}/${length}`;
    },
    isChecklistDone() {
      const done = this.task.checklist[0].todos.filter((todo) => todo.isDone);
      if (done.length === this.task.checklist[0].todos.length) return true;

      return '';
    },
    isDueCompleted() {
      return this.isDueComplete ? 'is-due-complete' : 'is-due-future';
    },
    isDuePassed() {
      return this.dueStatus;
    },
  },
  watch: {
    task() {
      this.taskTitle = this.task.title;
    },
  },
  components: {
    iconBase,
    resizableTextarea,
  },
};
</script>
