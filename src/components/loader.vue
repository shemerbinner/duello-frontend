<template>
  <svg :style="{ color: color }" class="loader" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
    <line stroke="currentColor" class="line animated" x1="14" y1="10" x2="14" y2="50" />
    <line stroke="currentColor" class="line animated line2" x1="30" y1="10" x2="30" y2="50" />
    <line stroke="currentColor" class="line animated line3" x1="46" y1="10" x2="46" y2="50" />
  </svg>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      required: true,
    },
  },
};
</script>
