<template>
  <section class="activity-cmp">
    <img :src="info.byMember.imgUrl" alt="user" />
    <div>
      <div class="activity-header">
        <span class="member-name">{{ info.byMember.fullname }}</span>
        <span class="action"> {{ info.action }}</span>
      </div>
      <span class="time">{{ createdAt }} ago</span>
    </div>
  </section>
</template>

<script>
import { formatDistance } from 'date-fns';

export default {
  props: {
    info: {
      type: Object,
      required: true,
    },
    isMenu: {
      type: Boolean,
      required: false,
    },
  },
  computed: {
    createdAt() {
      return formatDistance(new Date(this.info.createdAt), new Date(Date.now()));
    },
  },
};
</script>
