<template>
  <textarea
    rows="1"
    :disabled="disabled"
    ref="textarea"
    :value="value"
    @input="onInput"
    @blur="handleBlur"
    :placeholder="placeholder"
  ></textarea>
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      required: false,
    },
    autofocus: {
      type: Boolean,
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
    },
  },
  methods: {
    updateHeigh() {
      this.$refs.textarea.style.height = 'auto';
      this.$refs.textarea.style.height = this.$refs.textarea.scrollHeight + 'px';
    },
    onInput(e) {
      this.$emit('valueChange', e.target.value);
    },
    handleBlur() {
      this.$emit('focusOut');
    },
  },
  mounted() {
    if (this.autofocus) {
      this.$refs.textarea.focus();
    }
    this.updateHeigh();
  },
  watch: {
    value() {
      this.updateHeigh();
    },
  },
  updated() {
    this.updateHeigh();
  },
};
</script>
