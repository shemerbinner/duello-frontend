<template>
  <section class="task-quick-edit">
    <div class="backdrop" @click="close"></div>
    <div class="task-wrapper" :style="style" v-if="task">
      <div class="task-preview-container">
        <div v-if="task.style.cover.style === 'solid'" class="task-prev-cover">
          <div class="cover-clr" :style="'background-color:' + task.style.cover.color">
            <img class="cover-img" v-if="task.style.cover.type === 'img'" :src="task.style.cover.imgUrl" />
          </div>
        </div>
        <task-preview
          :style="
            task.style.cover.style === 'background'
              ? `background-image: url(${task.style.cover.imgUrl}); background-color:${task.style.cover.color}`
              : ''
          "
          :class="[
            task.style.cover.style === 'background' && task.style.cover.type === 'img' ? 'task-prev-bcg' : '',
            task.style.cover.style === 'background' && task.style.cover.type === 'color' ? 'task-prev-clr' : '',
          ]"
          :task="this.task"
          :canEditTitle="true"
          @editTask="updateTask"
        ></task-preview>
        <span class="bcg-helper" v-if="task.style.cover.style === 'background'"></span>
      </div>
      <div class="edit-menu">
        <button @click="openDetails">
          <icon-base iconName="cardB" />
          <span>Open Card</span>
        </button>
        <button @click="selectComponent('label-cmp')">
          <icon-base iconName="label" />
          <span>Edit labels</span>
        </button>
        <button @click="selectComponent('member-cmp')">
          <icon-base iconName="member" />
          <span>Change members</span>
        </button>
        <button @click="selectComponent('cover-cmp')">
          <icon-base iconName="cover" />
          <span>Change cover</span>
        </button>
        <button @click="selectComponent('calendar-cmp')">
          <icon-base iconName="clock" />
          <span>Edit dates</span>
        </button>
        <button @click="archive">
          <icon-base iconName="archive" />
          <span>Archive</span>
        </button>
      </div>

      <div class="dynamic-cmp-container" v-if="cmp !== null">
        <component
          :is="cmp"
          :board="board"
          :task="task"
          :date="task.dueDate"
          @addLabel="addLabel"
          @updateBoardLabel="updateBoardLabel"
          @deleteBoardLabel="deleteBoardLabel"
          @createBoardLabel="createBoardLabel"
          @saveDate="saveDate"
          @removeDate="removeDate"
          @close="hideComponent"
          @addMember="addMember"
          @setCoverColor="setCoverColor"
          @setCoverImg="setCoverImg"
          @setCoverStyle="setCoverStyle"
        />
      </div>
      <button @click="save" class="save-btn">Save</button>
    </div>
  </section>
</template>
<script>
import { boardService } from '../services/board.service';

import iconBase from './icon-base.vue';
import taskPreview from '../components/task-preview.vue';
import labelCmp from '../components/dynamic-components/label-cmp.vue';
import memberCmp from '../components/dynamic-components/member-cmp.vue';
import coverCmp from '../components/dynamic-components/cover-cmp.vue';
import calendarCmp from '../components/dynamic-components/calendar-cmp.vue';
import { designService } from '../services/design.services';

export default {
  props: {
    groupId: {
      type: String,
      required: true,
    },
    taskId: {
      type: String,
      required: true,
    },
    position: {
      type: Object,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      taskPartial: null,
      taskToEdit: null,
      cmp: null,
      loggedinUser: null,
    };
  },
  methods: {
    formatDate(dateString) {
      return new Date(dateString).toDateString();
    },
    addLabel(label) {
      const labelId = label.id;
      if (!this.taskToEdit.labelIds) {
        this.taskToEdit.labelIds = [labelId];
      } else {
        if (this.taskToEdit.labelIds.includes(labelId)) {
          this.taskToEdit.labelIds = this.taskToEdit.labelIds.filter((id) => id !== labelId);
        } else {
          this.taskToEdit.labelIds.unshift(labelId);
        }
      }
      this.$store.dispatch({
        type: 'updateTask',
        taskPartial: JSON.parse(JSON.stringify(this.taskToEdit)),
        groupId: this.groupId,
      });
    },
    updateBoardLabel(label) {
      this.$store.dispatch({
        type: 'updateBoardLabel',
        label: label,
        boardId: this.boardId,
      });
    },
    deleteBoardLabel(labelId) {
      this.$store.dispatch({
        type: 'deleteBoardLabel',
        labelId: labelId,
        boardId: this.boardId,
      });
    },
    createBoardLabel(labelData) {
      this.$store.dispatch({
        type: 'createBoardLabel',
        labelData: labelData,
        boardId: this.boardId,
      });
    },
    setCoverColor(color) {
      const taskPartial = JSON.parse(JSON.stringify(this.taskToEdit));
      taskPartial.style.cover.type = 'color';
      taskPartial.style.cover.color = color;
      taskPartial.style.cover.imgUrl = '';
      if (!taskPartial.style.cover.style && color) taskPartial.style.cover.style = 'solid';
      this.$store.dispatch({
        type: 'updateTask',
        taskPartial,
        groupId: this.groupId,
      });
    },
    async setCoverImg(imgUrl) {
      const taskPartial = JSON.parse(JSON.stringify(this.taskToEdit));
      taskPartial.style.cover.type = 'img';
      taskPartial.style.cover.imgUrl = imgUrl;
      if (imgUrl) taskPartial.style.cover.color = (await designService.getAvgColor(taskPartial.style.cover.imgUrl)).hex;
      else taskPartial.style.cover.color = '';
      if (!taskPartial.style.cover.style && imgUrl) taskPartial.style.cover.style = 'solid';
      this.$store.dispatch({
        type: 'updateTask',
        taskPartial,
        groupId: this.groupId,
      });
    },
    setCoverStyle(coverStyle) {
      const taskPartial = JSON.parse(JSON.stringify(this.taskToEdit));
      taskPartial.style.cover.style = coverStyle;
      this.$store.dispatch({
        type: 'updateTask',
        taskPartial,
        groupId: this.groupId,
      });
    },
    addMember(member) {
      const idx = this.taskToEdit.members.findIndex((mmbr) => mmbr._id === member._id);
      let members;
      if (idx === -1) {
        members = [member, ...this.taskToEdit.members];
      } else {
        members = this.taskToEdit.members.filter((mmbr) => mmbr.id !== member.id);
      }
      this.$store.dispatch({
        type: 'updateTask',
        taskPartial: {
          id: this.taskToEdit.id,
          members,
        },
        groupId: this.groupId,
      });
    },
    async removeDate() {
      this.hideComponent();
      this.taskToEdit.dueDate = null;
      try {
        this.$store.dispatch({
          type: 'updateTask',
          taskPartial: this.taskToEdit,
          groupId: this.groupId,
        });
      } catch (err) {
        console.log(err);
      }
      this.addActivity({ type: 'activity-cmp', action: `removed the due date from this card` });
    },
    addActivity({ type, action }) {
      const activity = boardService.getEmptyActivity();
      activity.type = type;
      activity.action = action;
      activity.byMember = this.loggedinUser;
      activity.task = { id: this.taskToEdit.id, title: this.taskToEdit.title };
      this.$store.dispatch({
        type: 'updateTask',
        taskPartial: {
          id: this.taskToEdit.id,
          activities: [activity, ...this.taskToEdit.activities],
        },
        groupId: this.groupId,
      });
      // this.$store.dispatch({
      //   type: 'getActivities',
      // });
    },
    async saveDate(date) {
      this.hideComponent();
      this.taskToEdit.dueDate = date;
      try {
        this.$store.dispatch({
          type: 'updateTask',
          taskPartial: this.taskToEdit,
          groupId: this.groupId,
        });
      } catch (err) {
        console.log(err);
      }
      const title = this.formatDate(this.taskToEdit.dueDate);
      this.addActivity({ type: 'activity-cmp', action: `set this card to be due ${title}` });
    },
    openDetails() {
      this.$emit('openDetails');
    },
    close() {
      this.$emit('close');
    },
    selectComponent(type) {
      this.cmp = type;
    },
    hideComponent() {
      this.cmp = null;
    },
    save() {
      if (this.taskPartial !== null) {
        this.$store.dispatch({ type: 'updateTask', taskPartial: this.taskPartial, groupId: this.groupId });
      }
      this.close();
    },
    updateTask(taskPartial) {
      this.taskPartial = taskPartial;
    },
    async archive() {
      await this.$store.dispatch({ type: 'removeTask', taskId: this.taskId, groupId: this.groupId });
      this.$emit('close');
    },
  },
  async created() {
    const user = await this.$store.getters.user;
    this.loggedinUser = user;
    this.taskToEdit = { ...this.task };
  },
  components: {
    iconBase,
    taskPreview,
    labelCmp,
    memberCmp,
    coverCmp,
    calendarCmp,
  },
  computed: {
    style() {
      return { left: this.position.left + 'px', top: this.position.top + 'px', width: this.width + 'px' };
    },
    board() {
      return this.$store.getters.board;
    },
    task() {
      const group = this.$store.getters.groups.find((group) => group.id === this.groupId);
      return group.tasks.find((task) => task.id === this.taskId);
      // console.log(this.group.tasks.find((task) => task.id === this.taskId));
      // return this.group.tasks.find((task) => task.id === this.taskId);
    },
  },
};
</script>
