<template>
  <div @click.self="closeTaskDetails" class="details-bc">
    <div class="task-details" v-if="taskToEdit">
      <div class="task-header-container">
        <button class="details-btn" @click="closeTaskDetails">
          <icon-base iconName="x" />
        </button>

        <div v-if="taskToEdit.style.cover.type" class="cover-container">
          <div class="cover-clr" :style="'background-color:' + taskToEdit.style.cover.color">
            <img class="cover-img" v-if="taskToEdit.style.cover.type === 'img'" :src="taskToEdit.style.cover.imgUrl" />
          </div>
        </div>
        <div class="task-details-container">
          <icon-base class="card-header" iconName="cardB" />
          <div>
            <resizable-textarea :value="taskToEdit.title" @valueChange="handleTitleChange" @focusOut="saveTitle" />
            <div class="info-in-group">
              <p>
                in list
                <span>{{ group.title }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="main-container">
        <div class="content-displayed">
          <div class="container">
            <div v-if="taskToEdit.members.length" class="member-list">
              <h2>Memebers</h2>
              <div class="member-container">
                <ul>
                  <li v-for="member in taskToEdit.members" :key="member._id">
                    <img :src="member.imgUrl" />
                  </li>
                </ul>
                <button class="add-btn" @click="selectComponent('member-cmp')">
                  <icon-base iconName="plus" />
                </button>
              </div>
            </div>
            <div class="labels-for-display" v-if="labels.length >= 1">
              <h2>Labels</h2>
              <div class="labels-container">
                <div class="label" v-for="label in labels" :key="label.id" :style="'background-color:' + label.color">
                  {{ label.title }}
                </div>
                <button class="add-btn" @click="selectComponent('label-cmp')">
                  <icon-base iconName="plus" />
                </button>
              </div>
            </div>
            <div class="dueDate" v-if="taskToEdit.dueDate" @click="selectComponent('calendar-cmp')">
              <h2>Due date</h2>
              <span>
                {{ formatDate(taskToEdit.dueDate) }}
                <icon-base iconName="chevron-down" />
              </span>
            </div>
          </div>
          <description-details :taskToEdit="taskToEdit" @save="saveDesc" />
          <attachment-details :attachments="taskToEdit.attachments" />
          <checklist-details
            v-for="checklist in taskToEdit.checklist"
            :key="checklist.id"
            :checklist="checklist"
            @save="updateChecklist"
            @remove="removeChecklist"
          />
          <activity-details
            :task="taskToEdit"
            :user="loggedinUser"
            @save="saveComment"
            @edit="editComment"
            @deleteComment="deleteComment"
          />
        </div>
        <task-details-menu
          :isMember="isMember"
          @joinTask="joinTask"
          @openModal="selectComponent"
          @removeTask="removeTask"
        />
        <div class="dynamic-cmp">
          <component
            :is="cmp"
            :board="board"
            :task="taskToEdit"
            :groups="groups"
            :date="taskToEdit.dueDate"
            @saveDate="saveDate"
            @removeDate="removeDate"
            @addLabel="addLabel"
            @updateBoardLabel="updateBoardLabel"
            @deleteBoardLabel="deleteBoardLabel"
            @createBoardLabel="createBoardLabel"
            @close="hideComponent"
            @addMember="addMember"
            @saveAttachment="saveAttachment"
            @setCoverColor="setCoverColor"
            @setCoverImg="setCoverImg"
            @setCoverStyle="setCoverStyle"
            @addChecklist="addChecklist"
          />
        </div>
      </div>
    </div>
    <loader v-else color="white" />
  </div>
</template>

<script>
import { socketService } from '../services/socket.service';
import { taskService } from '../services/task.service';
import { designService } from '../services/design.services';
import { boardService } from '../services/board.service';
import iconBase from './icon-base.vue';
import taskDetailsMenu from '../components/task-details-menu.vue';
import labelCmp from './dynamic-components/label-cmp.vue';
import memberCmp from './dynamic-components/member-cmp.vue';
import checklistCmp from './dynamic-components/checklist-cmp.vue';
import calendarCmp from './dynamic-components/calendar-cmp.vue';
import attachmentCmp from './dynamic-components/attachment-cmp.vue';
import descriptionDetails from './description-details.vue';
import activityDetails from './activity-details.vue';
import attachmentDetails from '../components/attachment-details.vue';
import checklistDetails from './checklist-details.vue';
import coverCmp from './dynamic-components/cover-cmp.vue';
import giphyCmp from './dynamic-components/giphy-cmp.vue';
import resizableTextarea from './resizable-textarea.vue';
// import { threadId } from 'worker_threads';
import copyCmp from './dynamic-components/copy-cmp.vue';
import loader from './loader.vue';

export default {
  props: {
    taskId: {
      type: String,
      required: true,
    },
    groupId: {
      type: String,
      required: true,
    },
    boardId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      taskToEdit: null,
      loggedinUser: null,
      group: null,
      savedDate: null,
      cmp: null,
    };
  },
  async created() {
    const user = await this.$store.getters.user;
    this.loggedinUser = user;
    const res = await taskService.getById(this.taskId, this.groupId, this.boardId);
    this.taskToEdit = { ...res.task };
    this.group = { ...res.group };
    socketService.emit('details', this.taskToEdit.id);
    socketService.on('update', async (board) => {
      const res = await taskService.getById(this.taskId, this.groupId, this.boardId);
      this.taskToEdit = { ...res.task };
    });
  },
  methods: {
    doUpdateTask() {
      this.$store.dispatch({
        type: 'updateTask',
        taskPartial: JSON.parse(JSON.stringify(this.taskToEdit)),
        groupId: this.groupId,
      });
    },
    handleTitleChange(value) {
      this.taskToEdit.title = value;
    },
    saveTitle() {
      this.doUpdateTask();
    },
    addActivity({ type, action }) {
      const activity = boardService.getEmptyActivity();
      activity.type = type;
      activity.action = action;
      activity.byMember = this.loggedinUser;
      activity.task = { id: this.taskToEdit.id, title: this.taskToEdit.title };
      this.taskToEdit.activities.unshift(activity);
      socketService.emit('loading', { ...this.taskToEdit });

      this.doUpdateTask();
      this.$store.dispatch({
        type: 'getActivities',
      });
    },
    removeChecklist(checkId) {
      const idx = this.taskToEdit.checklist.findIndex((list) => list.id === checkId);
      const title = this.taskToEdit.checklist[idx].title;
      this.taskToEdit.checklist.splice(idx, 1);
      socketService.emit('loading', { ...this.taskToEdit });
      this.doUpdateTask();
      this.addActivity({ type: 'activity-cmp', action: `removed ${title} from this card` });
    },
    updateChecklist(checklist) {
      const idx = this.taskToEdit.checklist.findIndex((list) => list.id === checklist.id);
      this.taskToEdit.checklist.splice(idx, 1, checklist);
      socketService.emit('loading', { ...this.taskToEdit });
      this.doUpdateTask();
      this.addActivity({ type: 'activity-cmp', action: `updated ${checklist.title} in this card` });
    },
    async addChecklist(newChecklist) {
      this.taskToEdit.checklist.unshift(newChecklist);
      await this.doUpdateTask();
      // socketService.emit('loading', { ...this.taskToEdit });
      this.addActivity({ type: 'activity-cmp', action: `added ${newChecklist.title} to this card` });
      this.hideComponent();
    },
    saveAttachment(attachment) {
      const attachments = [attachment, ...this.taskToEdit.attachments];
      this.$store.dispatch({
        type: 'updateTask',
        taskPartial: { id: this.taskId, attachments },
        groupId: this.groupId,
      });
      this.taskToEdit.attachments = attachments;
      const title = attachment.name ? attachment.name : attachment.url;
      socketService.emit('loading', { ...this.taskToEdit });
      this.addActivity({ type: 'activity-cmp', action: `attached ${title} to this card` });
    },
    deleteComment(commentId) {
      const comments = this.taskToEdit.comments.filter((com) => com.id !== commentId);
      this.$store.dispatch({
        type: 'updateTask',
        taskPartial: { id: this.taskId, comments },
        groupId: this.groupId,
      });
      this.taskToEdit.comments = comments;
    },
    editComment(comment) {
      const comments = this.taskToEdit.comments.map((com) => {
        if (com.id === comment.id) {
          com = comment;
          return com;
        }
        return com;
      });
      this.$store.dispatch({
        type: 'updateTask',
        taskPartial: { id: this.taskId, comments },
        groupId: this.groupId,
      });
      this.taskToEdit.comments = comments;
      this.addActivity({ type: 'activity-cmp', action: `edited a comment from this card` });
    },
    async saveComment(comment, taskId) {
      if (!taskId) {
        taskId = this.taskToEdit.id;
      }
      this.taskToEdit.comments.unshift(comment);
      await this.$store.dispatch({
        type: 'updateTask',
        taskPartial: { id: taskId, comments: [...this.taskToEdit.comments] },
        groupId: this.groupId,
      });
      this.addActivity({ type: 'activity-cmp', action: `added comment from this card` });
    },
    formatDate(dateString) {
      return new Date(dateString).toDateString();
    },
    async joinTask() {
      this.taskToEdit.members.unshift(this.loggedinUser);
      socketService.emit('loading', { ...this.taskToEdit });
      this.doUpdateTask();
    },
    saveDesc(task) {
      this.taskToEdit = task;
      socketService.emit('loading', { ...this.taskToEdit });
      this.$store.dispatch({
        type: 'updateTask',
        taskPartial: task,
        groupId: this.groupId,
      });
    },
    selectComponent(type) {
      if (this.cmp === type) {
        this.hideComponent();
      } else {
        this.cmp = type;
      }
    },
    hideComponent() {
      this.cmp = null;
    },
    closeTaskDetails() {
      this.$emit('closeTaskDetails');
    },
    setCoverColor(color) {
      this.taskToEdit.style.cover.type = 'color';
      this.taskToEdit.style.cover.color = color;
      this.taskToEdit.style.cover.imgUrl = '';
      if (!this.taskToEdit.style.cover.style && color) this.taskToEdit.style.cover.style = 'solid';
      socketService.emit('loading', { ...this.taskToEdit });
      this.doUpdateTask();
    },
    async setCoverImg(imgUrl) {
      this.taskToEdit.style.cover.type = 'img';
      this.taskToEdit.style.cover.imgUrl = imgUrl;
      if (imgUrl)
        this.taskToEdit.style.cover.color = (await designService.getAvgColor(this.taskToEdit.style.cover.imgUrl)).hex;
      else this.taskToEdit.style.cover.color = '';
      if (!this.taskToEdit.style.cover.style && imgUrl) this.taskToEdit.style.cover.style = 'solid';
      socketService.emit('loading', { ...this.taskToEdit });
      this.doUpdateTask();
    },
    setCoverStyle(coverStyle) {
      this.taskToEdit.style.cover.style = coverStyle;
      socketService.emit('loading', { ...this.taskToEdit });
      this.doUpdateTask();
    },
    async saveDate(date) {
      console.log(date);
      this.hideComponent();
      this.taskToEdit.dueDate = date;
      socketService.emit('loading', { ...this.taskToEdit });
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
    addMember(member) {
      const idx = this.taskToEdit.members.findIndex((mmbr) => mmbr._id === member._id);
      if (idx === -1) {
        this.taskToEdit.members.unshift(member);
      } else {
        this.taskToEdit.members.splice(idx, 1);
      }
      socketService.emit('loading', { ...this.taskToEdit });
      this.doUpdateTask();
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
      socketService.emit('loading', { ...this.taskToEdit });
      this.addActivity({ type: 'activity-cmp', action: `removed the due date from this card` });
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
    async addLabel(label) {
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
      socketService.emit('loading', { ...this.taskToEdit });
      await this.doUpdateTask();
    },
    removeTask() {
      this.$store.dispatch({ type: 'removeTask', taskId: this.taskId, groupId: this.groupId });
      this.closeTaskDetails();
    },
  },
  computed: {
    labels() {
      return this.$store.getters.boardLabels.filter((label) => {
        if (!this.taskToEdit.labelIds) return false;
        return this.taskToEdit.labelIds.includes(label.id);
      });
    },
    board() {
      return this.$store.getters.board;
    },
    isMember() {
      return this.taskToEdit.members.some((member) => member._id === this.loggedinUser._id);
    },
    coverStyle() {
      if (this.taskToEdit.style.cover.type === 'color') {
        return `background-color: ${this.taskToEdit.style.cover.color}`;
      }
      if (this.taskToEdit.style.cover.type === 'img') {
        return `background-image: url(${this.taskToEdit.style.cover.imgUrl}); max-height: 160px `;
      }
      return '';
    },
    groups() {
      return this.$store.getters.groups;
    },
  },
  components: {
    taskDetailsMenu,
    labelCmp,
    memberCmp,
    checklistCmp,
    checklistDetails,
    calendarCmp,
    coverCmp,
    descriptionDetails,
    activityDetails,
    attachmentCmp,
    attachmentDetails,
    iconBase,
    giphyCmp,
    resizableTextarea,
    copyCmp,
    loader,
  },
};
</script>
