<template>
  <section class="calendar-cmp">
    <header>
      <h2>Dates</h2>
      <button @click="close">
        <icon-base iconName="x" />
      </button>
    </header>
    <v-date-picker class="calendar" v-model="selectedDate" />
    <button class="save-btn" @click="saveDate">Save</button>
    <button class="remove-btn" @click="removeDate">Remove</button>
  </section>
</template>
<script>
import { DatePicker } from 'v-calendar';
import iconBase from '../icon-base.vue';
export default {
  props: {
    date: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      selectedDate: this.date ?? new Date().getTime(),
    };
  },
  methods: {
    saveDate() {
      this.$emit('saveDate', this.selectedDate);
    },

    removeDate() {
      this.$emit('removeDate');
    },
    close() {
      this.$emit('close');
    },
  },
  components: {
    DatePicker,
    iconBase,
  },
};
</script>
