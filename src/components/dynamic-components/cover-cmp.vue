<template>
  <section v-if="!isSearch" class="cover-cmp">
    <header>
      <div class="header-btn-container">
        <icon-base @click="closeModal" iconName="x"></icon-base>
      </div>
      <h2>Cover</h2>
    </header>
    <div class="main-content">
      <div class="cover-container">
        <div :style="coverStyle" @click="setCoverStyle('solid')" :class="['cover-prev']">
          <img src="../../assets/imgs/cover-img-solid.png" />
          <span class="board-title-fade"></span>
          <span :class="isSolidFocus"></span>
        </div>
        <div :style="coverStyle" @click="setCoverStyle('background')" :class="'cover-prev'">
          <img src="../../assets/imgs/cover-img-bcg.png" />
          <span :class="isBcgFocus"></span>
          <span class="board-title-fade"></span>
        </div>
      </div>
      <div v-if="colors">
        <p>Colors</p>
        <div class="color-container">
          <div v-for="color in colors" :key="color.id">
            <div @click="setCoverColor(color.color)" class="color-boxes" :style="'background-color:' + color.color">
              <span class="board-title-fade"></span>

              <span :class="color.color === task.style.cover.color ? 'focused' : ''"></span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <p>Attachments</p>
        <div class="upload-container">
          <label class="btn" for="uploadImg">
            <span v-if="loading">Uploading Image...</span>
            <div class="search-btn" v-else>
              <span>Upload a cover image</span>
              <input id="uploadImg" type="file" @change="onUploadImg" hidden />
            </div>
          </label>
        </div>
      </div>

      <div v-if="imgs">
        <p>Pohots from Unsplash</p>
        <div class="img-container">
          <div @click="setCoverImg(img)" class="img-boxes" v-for="img in imgs" :key="img">
            <img :src="img" />
            <span class="board-title-fade"></span>
            <span :class="img === task.style.cover.imgUrl ? 'focused' : ''"></span>
          </div>
        </div>
        <button @click="openImgSearch" class="search-btn">Search for photos</button>
      </div>
    </div>
  </section>

  <section v-else class="cover-cmp">
    <header>
      <div class="header-btn-container">
        <icon-base @click="closeModal" iconName="x"></icon-base>
        <icon-base @click="closeSearch" iconName="icon-back"></icon-base>
      </div>
      <h2>Photo search</h2>
    </header>
    <div class="main-content search">
      <input @input="searchImg" type="text" placeholder="Search Unsplash for pohotos" v-model="imgSearch" />
      <label>
        <icon-base v-if="imgSearch" class="x" @click="setSearch('')" iconName="x"></icon-base>
      </label>
      <div v-if="!imgSearch" class="suggested">
        <div class="search-words">
          <p>Suggested searches</p>
          <button v-for="keys in suggested" :key="keys" @click="setSearch(keys)">{{ keys }}</button>
        </div>
        <p>Top photos</p>
        <div class="img-container">
          <div @click="setCoverImg(img)" class="img-boxes" v-for="img in imgs">
            <img :src="img" />
            <span class="board-title-fade"></span>
          </div>
        </div>
      </div>
      <div v-else class="results">
        <div class="search-words">
          <p>Suggested searches</p>
        </div>
        <p>Results</p>
        <div class="img-container">
          <div @click="setCoverImg(img)" class="img-boxes" v-for="img in imgs">
            <img :src="img" />
            <span class="board-title-fade"></span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import iconBase from '../icon-base.vue';
import { designService } from '../../services/design.services.js';
import { uploadImg } from '../../services/imgUpload.service.js';

export default {
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      currColor: '',
      currImg: '',
      imgs: null,
      isSearch: false,
      imgSearch: '',
      loading: false,
    };
  },
  computed: {
    colors() {
      return this.$store.getters.colors;
    },

    coverStyle() {
      if (this.currImg) return `background-image: url(${this.currImg})`;
      return `background-color: ${this.currColor}`;
    },
    suggested() {
      return this.$store.getters.imgSearches;
    },
    isSolidFocus() {
      if (this.task.style.cover.style === 'solid') {
        return 'focused';
      } else return '';
    },
    isBcgFocus() {
      if (this.task.style.cover.style === 'background') return 'focused';
      else return '';
    },
  },
  components: { iconBase },
  methods: {
    async searchImg() {
      var imgs;
      if (!this.imgSearch) imgs = await designService.getImgs(12);
      else imgs = await designService.getImgs(60, this.imgSearch);
      this.imgs = imgs;
    },
    closeModal() {
      this.$emit('close');
    },
    setCoverColor(color) {
      if (color === this.currColor) {
        this.currColor = '';
        this.setCoverStyle(false);
      } else {
        this.currColor = color;
      }
      this.currImg = '';
      this.$emit('setCoverColor', this.currColor);
    },
    async setCoverImg(imgUrl) {
      if (imgUrl === this.currImg) {
        this.currImg = '';
        this.task.style.cover.style = '';
        this.setCoverStyle(false);
      } else {
        this.currImg = imgUrl;
      }
      this.currColor = '';
      this.$emit('setCoverImg', this.currImg);
      if (this.isSearch) {
        this.isSearch = false;
        const imgs = await designService.getImgs(5);
        imgs.unshift(this.currImg);
        this.imgs = imgs;
      }
    },
    setCoverStyle(coverStyle) {
      this.$emit('setCoverStyle', coverStyle);
    },
    async openImgSearch() {
      this.isSearch = true;
      const img = await designService.getImgs(12);
      this.imgs = img;
    },
    setSearch(keys) {
      this.imgSearch = keys;
      this.searchImg();
    },
    async closeSearch() {
      this.isSearch = false;
      const imgs = await designService.getImgs();
      if (this.currImg && !imgs.some((img) => img === this.currImg)) {
        imgs.splice(0, 1, this.currImg);
      }
      this.imgs = imgs;
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
      this.$emit('saveAttachment', attachment);
      this.setCoverImg(attachment.url);
      console.log(attachment);
    },
  },
  async created() {
    this.$store.dispatch('loadDesign');
    this.currColor = this.task.style.cover.color;
    this.currImg = this.task.style.cover.imgUrl;
    const imgs = await designService.getImgs();
    if (this.currImg && !imgs.some((img) => img === this.currImg)) {
      imgs.splice(0, 1, this.currImg);
    }
    this.imgs = imgs;
  },
};
</script>
