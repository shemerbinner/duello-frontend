<template>
  <section class="comment">
    <img :src="commentToEdit.byMember.imgUrl" alt="user" />

    <div class="comment-description">
      <span class="inline-member">{{ commentToEdit.byMember.fullname }}</span>
      <span class="inline-spacer"></span>
      <span class="comment-date">{{ createdAt }} ago</span>

      <div class="comment-container" v-if="!isEdit">
        <p>{{ commentToEdit.txt }}</p>
      </div>

      <div class="edit-comment" v-if="isEdit">
        <div class="comment-box">
          <resizable-textarea :value="commentToEdit.txt" @valueChange="onCommentChanged" :autofocus="true" />

          <button :class="['save-comment']" @click="editComment">Save</button>
          <icon-base class="close-btn" iconName="x" @click="isEdit = !isEdit" />

          <div class="comment-box-options">
            <icon-base class="option" iconName="paperclip" />
            <icon-base class="option" iconName="mention" />
            <icon-base class="option" iconName="emoji" />
            <icon-base class="option" iconName="cardS" />
          </div>
        </div>
      </div>
    </div>

    <div class="comment-actions" v-if="!isEdit && !isMenu">
      <div class="reactions">
        <icon-base iconName="add-reaction"></icon-base>
        <span>-</span>
      </div>

      <div class="actions">
        <button @click.stop="isEdit = !isEdit">Edit</button>
        <span>-</span>
        <button @click="open">Delete</button>
      </div>

      <div class="delete-confirmation-modal" v-if="openModal">
        <div class="delete-header">
          <span>Delete comment?</span>

          <icon-base iconName="xs" @click="openModal = !openModal" />
        </div>

        <div>
          <p>Deleting a comment is forever. There is no undo.</p>
          <button @click="deleteComment">Delete comment</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { eventBus } from '../services/eventBus.service';
import { formatDistance } from 'date-fns';
import iconBase from './icon-base.vue';
import resizableTextarea from './resizable-textarea.vue';

export default {
  props: {
    comment: {
      type: Object,
      required: true,
    },
    isModalsOpen: {
      type: Boolean,
      required: false,
    },
    isMenu: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      isEdit: false,
      commentToEdit: { ...this.comment },
      openModal: false,
    };
  },
  created() {
    this.unsubscribe = eventBus.on('open-delete-modal', this.closeModal);
  },
  methods: {
    onCommentChanged(value) {
      this.commentToEdit.txt = value;
    },
    open() {
      eventBus.emit('open-delete-modal', false);
      this.openModal = !this.openModal;
    },
    closeModal() {
      if (this.openModal) this.openModal = false;
    },
    editComment() {
      if (!this.commentToEdit.txt) return;
      this.commentToEdit.createdAt = Date.now();
      this.$emit('edit', { ...this.commentToEdit });
      this.isEdit = !this.isEdit;
    },
    deleteComment() {
      this.$emit('deleteComment');
      this.openModal = false;
    },
  },
  computed: {
    createdAt() {
      return formatDistance(new Date(this.commentToEdit.createdAt), new Date(Date.now()));
    },
  },
  components: { iconBase, resizableTextarea },
  unmounted() {
    this.unsubscribe();
  },
};
</script>
