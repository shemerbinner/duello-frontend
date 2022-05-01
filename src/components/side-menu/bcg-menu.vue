<template>
    <section class="bcColor-menu">
        <div class="main-content">
            <input type="text" v-model="imgSearch" placeholder="Photos" @input="searchImgs" />
            <div class="img-container">
                <img
                    v-if="imgs"
                    class="img-box"
                    v-for="img in imgs"
                    :key="img"
                    :src="img"
                    @click="setBc(img)"
                />
            </div>
        </div>
    </section>
</template>

<script>
import { designService } from '../../services/design.services';

export default {
    data() {
        return {
            imgSearch: '',
            imgs: null
        };
    },
    async created() {
        const imgs = await designService.getImgs(100, 'desktop wallpaper', 'regular')
        this.imgs = imgs
        console.log(imgs)
    },
    methods: {
        async searchImgs() {
            const imgs = await designService.getImgs(100, this.imgSearch, 'regular')
            this.imgs = imgs
        },
        async setBc(img) {
            this.$emit('setBc', img)
        },

    }
};
</script>
