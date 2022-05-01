<template>
  <section class="main-board" :style="bcg" v-if="board">
    <main-header />
    <board-header />

    <section class="groups-container-wrapper">
      <Container
        orientation="horizontal"
        @drop="onDrop"
        :get-child-payload="getChildPayload"
        drag-class="card-ghost"
        drop-class="card-ghost-drop"
        :drop-placeholder="{ className: 'drop-preview' }"
      >
        <Draggable v-for="group in board.groups" :key="group.id" class="group-wrapper">
          <board-group
            :group="JSON.parse(JSON.stringify(group))"
            :board="board"
            :draggingCard="draggingCard"
            @onDragTask="onDragTask"
            @setDraggedTask="setDraggedTask"
            @editGroup="editGroup"
            @removeGroup="removeGroup"
            @removeTask="removeTask"
            @updateTask="updateTask"
            @addTask="addTask"
            @onOpen="openModal"
            @quickEdit="(task, position, width) => quickEdit(task, position, width, group)"
          />
        </Draggable>
      </Container>
      <add-group @addGroup="addGroup" class="group-wrapper" />
    </section>

    <task-details
      v-if="isOpenModal"
      :taskId="taskId"
      :groupId="groupId"
      :boardId="board._id"
      @closeTaskDetails="isOpenModal = !isOpenModal"
      @updateTask="updateTask"
    />
    <task-quick-edit
      v-if="quickEditData !== null"
      :taskId="quickEditData.task.id"
      :position="quickEditData.position"
      :width="quickEditData.width"
      :groupId="quickEditData.group.id"
      @close="closeQuickEdit"
      @openDetails="openModal(quickEditData.task.id, quickEditData.group.id)"
      @updateTask="updateTask"
    />
  </section>
</template>

<script>
import { Container, Draggable } from 'vue3-smooth-dnd';
import { socketService } from '../services/socket.service';
import { utilService } from '../services/util.service';
import boardHeader from '../components/board-header.vue';
import mainHeader from '../components/main-header.vue';
import boardGroup from '../components/board-group.vue';
import addGroup from '../components/add-group.vue';
import createBoard from '../components/create-board.vue';
import taskDetails from '../components/task-details.vue';
import taskQuickEdit from '../components/task-quick-edit.vue';

export default {
  data() {
    return {
      isOpenModal: false,
      taskId: null,
      groupId: null,
      board: null,
      quickEditData: null,
      draggingCard: null,
    };
  },
  async created() {
    const board = await this.$store.dispatch({
      type: 'loadBoard',
      boardId: this.$route.params.boardId,
    });
    this.board = this.$store.getters.board;
    const user = this.$store.getters.user;

    socketService.emit('on-board', this.board._id, user._id);
    socketService.emit('set-user-socket', user._id);
    socketService.on('update', (board, userId) => {
      if (userId !== user._id) {
        console.log('update');
        this.board = { ...board };
        return;
      }
      this.$store.dispatch({ type: 'updateBoardSocket', board });
      this.board = this.$store.getters.board;
    });
  },
  destroyed() {
    socketService.emit('unset-user-socket');
  },
  methods: {
    async onDragTask(group) {
      const idx = this.board.groups.findIndex((grp) => grp.id === group.id);
      this.board.groups.splice(idx, 1, group);
      await this.$store.dispatch({ type: 'drag', board: JSON.parse(JSON.stringify(this.board)) });
      this.board = JSON.parse(JSON.stringify(this.$store.getters.board));
    },
    setDraggedTask(task) {
      this.draggingCard = task;
    },
    async onDrop(dropResult) {
      dropResult.payload = this.getChildPayload(dropResult.removedIndex);
      const res = utilService.applyDrag(this.board.groups, dropResult);
      const board = { ...this.board };
      board.groups = res;
      this.board = await this.$store.dispatch({ type: 'drag', board });
      this.board = this.$store.getters.board;
      this.draggingCard = null;
    },
    getChildPayload(index) {
      // if (!this.board.groups) return;
      return this.board.groups[index];
    },
    closeQuickEdit() {
      this.quickEditData = null;
    },
    quickEdit(task, position, width, group) {
      this.quickEditData = { task, position, width, group };
    },
    openModal(taskId, groupId) {
      this.isOpenModal = true;
      this.taskId = taskId;
      this.groupId = groupId;
      this.quickEditData = null;
    },
    addGroup(title) {
      this.$store.dispatch({
        type: 'addGroup',
        title: title,
        boardId: this.board._id,
      });
    },
    removeGroup(groupId) {
      this.$store.dispatch({ type: 'removeGroup', groupId });
    },
    editGroup(newGroup) {
      this.$store.dispatch({ type: 'updateGroup', newGroup });
    },
    removeTask(taskId, groupId) {
      this.$store.dispatch({ type: 'removeTask', taskId, groupId });
    },
    updateTask(taskPartial, groupId) {
      this.$store.dispatch({ type: 'updateTask', taskPartial, groupId });
    },
    addTask(taskTitle, groupId, boardId) {
      this.$store.dispatch({ type: 'addTask', taskTitle, groupId, boardId });
    },
  },
  computed: {
    bcg() {
      if (!this.board) return;
      if (this.board.style.type === 'img') return `background-image: url(${this.board.style.backgroundImg})`;
      else return `background-color: ${this.board.style.color}`;
    },
  },
  components: {
    boardHeader,
    mainHeader,
    boardGroup,
    addGroup,
    taskDetails,
    createBoard,
    taskQuickEdit,
    Container,
    Draggable,
  },
};
</script>
