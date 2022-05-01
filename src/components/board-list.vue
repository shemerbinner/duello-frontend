<template>
  <section>
    <router-link :to="'/board/' + board._id">{{ board.title }}</router-link>
  </section>
</template>

<script>
export default {
  props: ['board'],
};
</script>

<style></style>
