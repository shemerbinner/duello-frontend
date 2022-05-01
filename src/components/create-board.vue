<template>
  <section>
    <section class="create-board">
      <header>
        <div class="header-btn-container">
          <icon-base @click="closeModal" iconName="x"></icon-base>
          <icon-base iconName="icon-back"></icon-base>
        </div>
        <h2>Create board</h2>
      </header>
      <div class="main-content">
        <div class="board-prev" :style="getPrevStyle">
          <icon-base iconName="board-prev"></icon-base>
        </div>
        <p>Background</p>
        <div v-if="imgs" class="img-container">
          <div class="img-boxes" v-for="img in imgs.slice(0, 4)" :key="img" @click="setBoardImg(img)">
            <img :src="img" />
          </div>
        </div>
        <div class="color-container">
          <div
            @click="setBoardClr(color.color)"
            v-for="color in colorsPrev.slice(0, 5)"
            :key="color.id"
            class="color-boxes"
            :style="'background-color:' + color.color"
          ></div>
          <button @click="toggleCostumizeModal" class="more-btn">
            <icon-base iconName="more"></icon-base>
          </button>
        </div>
        <p>
          Board title
          <span>*</span>
        </p>
        <form @submit.prevent="create">
          <input ref="myInput" :class="['board-name', isTitle]" type="text" v-model="boardToEdit.title" />
          <h3 v-if="!boardToEdit.title">👋 Board title is required</h3>
          <input class="add-btn" type="submit" value="Create" :disabled="!boardToEdit.title" />
        </form>
      </div>
    </section>
    <section class="costumize-modal" v-if="isCostumize">
      <header>
        <div class="header-btn-container">
          <icon-base @click="toggleCostumizeModal" iconName="x"></icon-base>
          <icon-base v-if="isSearch" @click="toggleSearch" iconName="icon-back"></icon-base>
          <icon-base v-if="isMoreColors" @click="toggleMoreColors" iconName="icon-back"></icon-base>
        </div>
        <h2>{{ modalTitle }}</h2>
      </header>
      <div v-if="!isSearch && !isMoreColors" class="main-content">
        <div class="see-more">
          <h3>Photos</h3>
          <h6 @click="toggleSearch">See more</h6>
        </div>
        <div class="img-container">
          <img @click="setBoardImg(img)" v-for="img in imgs" :key="img" :src="img" />
        </div>
        <div @click="toggleMoreColors" class="see-more">
          <h3>colors</h3>
          <h6>See more</h6>
        </div>
        <div class="color-container">
          <div
            v-for="color in colorsPrev.slice(0, 6)"
            :key="color.color"
            @click="setBoardClr(color.color)"
            :style="'background-color:' + color.color"
            class="color-box"
          ></div>
        </div>
      </div>
      <div v-else-if="isSearch" class="main-content">
        <input type="text" placeholder="Photos" v-model="search" @input="searchImgs" />
        <div class="img-container search">
          <img @click="setBoardImg(img)" v-for="img in searchImg" :key="img" :src="img" />
        </div>
      </div>
      <div v-else-if="isMoreColors" class="main-content">
        <div class="color-container">
          <div
            v-for="color in colorsPrev.slice(1, 10)"
            :key="color.color"
            @click="setBoardClr(color.color)"
            :style="'background-color:' + color.color"
            class="color-box"
          ></div>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import { boardService } from '../services/board.service';
import { designService } from '../services/design.services';
import iconBase from './icon-base.vue';
import isDarkColor from 'is-dark-color';

export default {
  data() {
    return {
      isCostumize: false,
      boardToEdit: boardService.getEmptyBoard(),
      loggedinUser: null,
      imgs: null,
      moreImgs: null,
      isSearch: false,
      isMoreColors: false,
      search: '',
      searchImg: null,
    };
  },
  async created() {
    this.loggedinUser = this.$store.getters.user;
    this.$store.dispatch('loadDesign');
    const imgs = await designService.getImgs(6, 'desktop wallpaper cute', 'regular');
    this.imgs = imgs;
    this.boardToEdit.style.backgroundImg = imgs[0];
    window.addEventListener('resize', this.onResize);
  },
  mounted() {
    this.$refs.myInput.focus();
  },
  methods: {
    onResize() {
      this.$emit('resizeClose');
    },
    setBoardClr(color) {
      this.boardToEdit.style.color = color;
      this.boardToEdit.style.type = 'color';
      this.boardToEdit.style.backgroundImg = '';
      this.boardToEdit.style.isDark = isDarkColor(color);
    },
    async setBoardImg(imgUrl) {
      this.boardToEdit.style.backgroundImg = imgUrl;
      this.boardToEdit.style.type = 'img';
      const color = await designService.getAvgColor(imgUrl);
      this.boardToEdit.style.color = color.hex;
      this.boardToEdit.style.isDark = color.isDark;
    },
    closeModal() {
      this.$emit('closeModal');
    },
    create() {
      this.boardToEdit.createdBy = this.loggedinUser;
      this.boardToEdit.members.unshift(this.loggedinUser);
      this.$emit('create', { ...this.boardToEdit });
    },
    async toggleCostumizeModal() {
      this.isCostumize = !this.isCostumize;
    },
    toggleSearch() {
      this.isSearch = !this.isSearch;
    },
    async searchImgs() {
      const imgs = await designService.getImgs(100, this.search, 'regular');
      this.searchImg = imgs;
    },
    toggleMoreColors() {
      this.isMoreColors = !this.isMoreColors;
    },
  },
  computed: {
    colors() {
      return this.$store.getters.colors;
    },
    colorsPrev() {
      if (!this.boardToEdit) return;
      return this.$store.getters.colors;
    },
    getPrevStyle() {
      if (!this.boardToEdit) return;
      if (this.boardToEdit.style.type === 'color') {
        return `background-color: ${this.boardToEdit.style.color};`;
      } else return `background-image: url(${this.boardToEdit.style.backgroundImg});`;
    },
    isTitle() {
      if (!this.boardToEdit.title) return 'no-title';
    },
    modalTitle() {
      if (!this.isSearch && !this.isMoreColors) return 'Board background';
      else if (this.isSearch) return 'Photos by Unspalsh';
      else return 'Colors';
    },
  },
  destroyed() {
    window.removeEventListener('resize', this.onResize);
  },
  components: { iconBase },
};
</script>

<style></style>
