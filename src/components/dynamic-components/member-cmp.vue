<template>
  <section class="members-cmp">
    <header>
      <h2>Members</h2>
      <button @click="close">
        <icon-base iconName="x" />
      </button>
    </header>
    <div class="main-content">
      <input type="search" placeholder="Search members..." v-model="searchMember" />
      <h2>Board members</h2>
      <ul class="memeber-list">
        <li v-for="member in filteredMembers" :key="member.id" @click="addMember(member)">
          <img :src="member.imgUrl" />
          <span class="member-name">{{ member.fullname }}</span>
          <label v-if="test(member._id)"><icon-base iconName="check" /></label>
        </li>
      </ul>
    </div>
  </section>
</template>
<script>
import iconBase from '../icon-base.vue';
export default {
  props: {
    board: {
      type: Object,
      required: true,
    },
    task: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      searchMember: '',
    };
  },
  methods: {
    close() {
      this.$emit('close');
    },
    addMember(member) {
      this.$emit('addMember', member);
    },
    isMemberSelected(memberId) {
      return this.task.members.some((member) => member.id === memberId);
    },
    test(memberId) {
      return this.task.members.some((member) => member._id === memberId);
    },
  },
  computed: {
    filteredMembers() {
      return this.board.members.filter((member) => {
        return member.fullname.toLowerCase().includes(this.searchMember.trim().toLowerCase());
      });
    },
  },
  components: { iconBase },
};
</script>
