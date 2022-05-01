<template>
    <section class="copy-cmp">
        <header>
            <div class="header-btn-container">
                <icon-base iconName="x"></icon-base>
            </div>
            <h2>Copy card</h2>
        </header>
        <div class="main-content">
            <p>Copy to...</p>
            <label for="group-opt">
                <button>

                    <span>List</span>
                <select style="appearance: none" id="group-opt">
                    <option v-for="group in groups" :key="group.id" :value="group">{{ group.title }}</option>
                </select>
                </button>
            </label>
        </div>
    </section>
</template>
<script>
import iconBase from '../icon-base.vue';
export default {
    props: {
        groups: {
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
