<template>
  <section class="attachment-cmp">
    <header>
      <h2>Attach from…</h2>
      <button @click="close">
        <icon-base iconName="x" />
      </button>
    </header>
    <div class="upload-container">
      <label for="uploadImg">
        <span v-if="loading">Uploading Image...</span>
        <div v-else>
          Computer
          <input id="uploadImg" type="file" @change="onUploadImg" hidden />
        </div>
      </label>
    </div>
    <div class="attach-link-container">
      <h2>Attach a link</h2>
      <input v-model="url" type="text" placeholder="Paste any link here..." />
      <div v-if="url !== ''">
        <h2>Link name (optional)</h2>
        <input v-model="linkName" type="text" />
      </div>
      <button class="attach-btn" @click="attachLink">Attach</button>
    </div>
  </section>
</template>
<script>
import iconBase from '../icon-base.vue';
import { uploadImg } from '../../services/imgUpload.service.js';
export default {
  props: {},
  data() {
    return {
      loading: false,
      linkName: '',
      url: '',
    };
  },
  methods: {
    attachLink() {
      if (!this.url.includes('https://')) return;
      const attachment = {
        type: 'link',
        url: this.url,
        name: this.linkName,
        created: new Date().getTime(),
      };
      this.close();
      this.$emit('saveAttachment', attachment);
    },
    async onUploadImg(ev) {
      this.loading = true;
      const res = await uploadImg(ev);
      this.loading = false;
      const { url, original_filename, original_extension, format } = res;
      const attachment = {
        type: 'image',
        url,
        fileName: `${original_filename}.${original_extension ?? format}`,
        created: new Date().getTime(),
      };
      this.close();
      this.$emit('saveAttachment', attachment);
    },

    close() {
      this.$emit('close');
    },
  },
  components: {
    iconBase,
  },
};
</script>
