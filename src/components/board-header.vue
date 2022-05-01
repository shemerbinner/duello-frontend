<template>
  <section>
    <section>
      <section>
        <board-menu :board="board" @closeMenu="toggleMenu" v-if="isMenuOpen"></board-menu>
      </section>

      <section :class="['board-header', txtClr]" v-if="board">
        <div class="board-details">
          <div class="board-name-and-star">
            <input
              type="text"
              ref="myInput"
              v-model="board.title"
              v-if="isEditing"
              @blur="isEditing = !isEditing"
              @input="changeTitle"
              :size="width"
            />
            <div class="board-name" v-if="!isEditing" @click="editMode">{{ board.title }}</div>

            <button @click="setFavorite">
              <icon-base iconName="star" :class="[isFavorite, 'starred']" @click="toggleFavorites" />
            </button>
            |
          </div>
          <button class="name-btn">Sprint</button> |
          <section class="members">
            <div class="member" v-for="member in board.members" :key="member._id">
              <img :src="member.imgUrl" referrerpolicy="no-referrer" alt="member" />
            </div>
            <button @click="toggleMembersModal">Invite</button>
          </section>
        </div>

        <div class="options">
          <button class="filter-btn">
            <icon-base iconName="filter" />
            <span>Filter</span>
          </button>
          <button class="show-menu-btn" @click="toggleMenu">
            <icon-base iconName="more" />
            <span>Show menu</span>
          </button>
        </div>
      </section>
    </section>

    <section v-if="isMemberModal" class="invite-member-modal">
      <header>
        <div class="header-btn-container">
          <icon-base @click="toggleMembersModal" iconName="x" />
        </div>
        <h2>Invite to board</h2>
      </header>
      <div class="main-content">
        <input v-model="userSearch" @input="searchMembers" type="text" placeholder="Search memeber by name" />
        <button>Send invintation</button>
      </div>
      <div v-if="userSearch" class="member-res-modal">
        <div
          class="member-container"
          v-if="membersRes"
          v-for="member in membersRes"
          :key="member._id"
          @click="addMember(member)"
        >
          <img :src="member.imgUrl" referrerpolicy="no-referrer" />
          <span>{{ member.fullname }}</span>
        </div>
        <div v-else>
          <span>No users found</span>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import iconBase from '../components/icon-base.vue';
import boardMenu from './board-menu.vue';

export default {
  components: { boardMenu },
  data() {
    return {
      isEditing: false,
      isFull: false,
      isMenuOpen: false,
      userSearch: '',
      isMemberModal: false,
      membersRes: null,
    };
  },
  methods: {
    editMode() {
      this.isEditing = !this.isEditing;
      this.$nextTick(() => this.$refs.myInput.focus());
    },
    setFavorite(boardId) {
      this.isFull = !this.isFull;
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    changeTitle() {
      this.$store.dispatch({ type: 'updateBoard', board: this.board });
    },
    toggleFavorites() {
      this.board.isStarred = !this.board.isStarred;
      this.$store.dispatch({ type: 'updateBoard', board: this.board });
    },
    toggleMembersModal() {
      this.isMemberModal = !this.isMemberModal;
    },
    async searchMembers() {
      const members = await this.$store.dispatch({ type: 'searchMembers', searchVal: this.userSearch });
      this.membersRes = members;
    },
    addMember(member) {
      if (this.board.members.some((mmbr) => mmbr._id === member._id)) return;
      else this.board.members.push(member);
      this.$store.dispatch({ type: 'updateBoard', board: this.board });
    },
  },
  computed: {
    isFavorite() {
      if (this.board.isStarred) return 'full-star';
      else return 'empty-star';
    },
    width() {
      return this.board.title.length;
    },
    board() {
      return JSON.parse(JSON.stringify(this.$store.getters.board));
    },
    txtClr() {
      const isDark = this.$store.getters.isDark;
      if (!isDark) return 'dark-bcg';
    },
  },
  components: {
    iconBase,
    boardMenu,
  },
};
</script>
