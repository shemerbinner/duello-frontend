<template>
  <section class="attachment-details" v-if="attachments.length >= 1">
    <div class="header">
      <icon-base iconName="attachment"></icon-base>
      <h3>Attachments</h3>
    </div>
    <div class="attachment-content">
      <ul>
        <li v-for="attachment in attachments" key="attachment.url">
          <div v-if="attachment.type === 'image'" class="attachment-item">
            <img class="img-attachment" :src="attachment.url" />
            <div class="details-container-display">
              <div class="attach-fileName">
                {{ attachment.fileName }}
              </div>
              <div class="attach-created">
                {{ formatDate(attachment.created) }}
              </div>
            </div>
          </div>

          <a v-if="attachment.type === 'link'" :href="attachment.url" target="_blank" class="attachment-item">
            <div class="link-box">LINK</div>
            <div class="details-container-display">
              <div class="attach-fileName">
                <div v-if="attachment.name !== ''">
                  {{ attachment.name }}
                </div>
                <div v-else>
                  {{ attachment.url }}
                </div>
              </div>
              <div class="attach-created">
                {{ formatDate(attachment.created) }}
              </div>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>
<script>
import iconBase from '../components/icon-base.vue';
export default {
  props: {
    attachments: {
      type: Array,
      required: true,
    },
  },
  methods: {
    formatDate(date) {
      return new Date(date).toDateString();
    },
  },
  components: {
    iconBase,
  },
};
</script>
