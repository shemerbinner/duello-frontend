<template>
  <section class="board-group">
    <div class="group-title">
      <div class="title-container">
        <input
          type="text"
          :class="{ isEditing: isEditing, mover: true }"
          v-model="group.title"
          @blur="editGroup(group)"
          @click="changeGroupTitle"
        />
      </div>
      <button @click="openEditModal" class="more-btn mover">
        <icon-base iconName="more"></icon-base>
      </button>
    </div>

    <div class="task-container">
      <ul>
        <Container
          v-if="(group.tasks && group.tasks.length) || draggingCard"
          group-name="list"
          orientation="vertical"
          @drop="onDrop"
          @drag-start="handleDragStart($event, group.id)"
          :get-child-payload="getChildPayload"
          drag-class="card-ghost"
          drop-class="card-ghost-drop"
          :drop-placeholder="{ className: 'drop-preview' }"
        >
          <Draggable v-for="task in group.tasks" :key="task.id" @click="openModalDetails(task.id)">
            <li class="task-li">
              <button @click.stop="quickEdit($event, task)" class="edit-btn">
                <icon-base iconName="pencil"></icon-base>
              </button>

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
                :task="task"
                :group="group"
                @editTask="updateTask"
                @removeTask="removeTask"
                @toggleLabelsExpanded="toggleLabelsExpanded"
              ></task-preview>
              <span class="bcg-helper" v-if="task.style.cover.style === 'background'"></span>
            </li>
          </Draggable>
        </Container>
      </ul>

      <div class="create-btn" v-if="isNewTask">
        <div class="new-task-container">
          <div class="textarea-wrapper">
            <resizable-textarea
              @focusOut="isNewTask = false"
              :value="taskTitle"
              @valueChange="(value) => (taskTitle = value)"
              class="new-task"
              :autofocus="true"
            />
          </div>
          <div class="buttons-container">
            <button @mousedown="addTask(group.id)" @touchstart="addTask(group.id)" class="add-card-btn">
              Add card
            </button>
            <button @click="isNewTask = false">
              <img src="../assets/icons/x.svg" alt="close form" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="create-btn">
      <div v-if="!isNewTask" class="add-task-container">
        <button class="add-task-btn" @click="createTask(group.id)">
          <icon-base iconName="+" />
          <span>Add a card</span>
        </button>
      </div>
    </div>

    <div @blur="openEditModal" v-if="isEditModal" class="group-edit-modal">
      <div class="modal-header">
        <span>List actions</span>
        <icon-base iconName="xs" @click="openEditModal" />
      </div>

      <div class="modal-content">
        <p @click="createTask(group.id)">Add card</p>
        <p @click="removeGroup(group.id)">Delete this list</p>
      </div>
    </div>
  </section>
</template>

<script>
import { utilService } from '../services/util.service.js';
import { Container, Draggable } from 'vue3-smooth-dnd';
import iconBase from './icon-base.vue';
import taskPreview from '../components/task-preview.vue';
import IconBase from './icon-base.vue';
import TaskPreview from '../components/task-preview.vue';
import resizableTextarea from './resizable-textarea.vue';

export default {
  props: {
    board: {
      type: Object,
      required: true,
    },
    group: {
      type: Object,
      required: true,
    },
    draggingCard: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      isEditing: false,
      title: this.group.title,
      taskTitle: '',
      isNewTask: false,
      isEditModal: false,
      isDrag: false,
      isEditingTask: false,
      boardCopy: JSON.parse(JSON.stringify(this.board)),
    };
  },
  created() {
    window.addEventListener('resize', this.onResize);
    this.$store.commit({ type: 'setGroup', group: this.group });
  },
  methods: {
    async onDrop(dropResult) {
      const { addedIndex, removedIndex } = dropResult;
      if (addedIndex || removedIndex || removedIndex === 0 || addedIndex === 0) {
        dropResult.payload = this.draggingCard.cardData;
        const res = utilService.applyDrag(this.group.tasks, dropResult);
        this.group.tasks = res;
        this.$emit('onDragTask', { ...this.group });
      }
      this.isDrag = false;
    },
    handleDragStart(dragResult) {
      this.isDrag = true;
      const { isSource } = dragResult;
      const index = dragResult.payload.index;
      if (isSource) {
        const draggingCard = {
          id: this.group.tasks[index].id,
          index,
          cardData: this.group.tasks[index],
        };

        this.$emit('setDraggedTask', { ...draggingCard });
      }
    },
    getChildPayload(index) {
      return {
        index,
      };
    },
    onResize() {
      if (this.isEditModal) this.isEditModal = false;
    },
    toggleLabelsExpanded() {
      this.$store.dispatch({
        type: 'toggleLabelsExpanded',
      });
    },
    openModalDetails(taskId) {
      this.$emit('onOpen', taskId, this.group.id);
    },
    openEditModal(ev) {
      this.isEditModal = !this.isEditModal;
    },
    closeEditModal(ev) {
      this.isEditModal = false;
    },
    editGroup(group) {
      group.title;
      this.$emit('editGroup', group);
      this.isEditing = false;
    },
    changeGroupTitle() {
      this.isEditing = true;
    },
    removeGroup(groupId) {
      this.$emit('removeGroup', groupId);
    },
    removeTask(taskId, groupId) {
      this.$emit('removeTask', taskId, groupId);
    },
    updateTask(taskPartial) {
      const groupId = this.group.id;
      this.$emit('updateTask', taskPartial, groupId);
    },
    createTask() {
      this.closeEditModal();
      this.isNewTask = !this.isNewTask;
    },
    addTask(groupId) {
      this.$emit('addTask', this.taskTitle, groupId);
      this.isNewTask = false;
      this.taskTitle = '';
    },
    quickEdit(ev, task) {
      const { left, top, width } = ev.target.closest('li').getBoundingClientRect();
      this.$emit('quickEdit', task, { left, top }, width);
    },
  },
  destroyed() {
    window.removeEventListener('resize', this.onResize);
  },
  components: {
    resizableTextarea,
    taskPreview,
    iconBase,
    IconBase,
    TaskPreview,
    Container,
    Draggable,
  },
};
</script>
