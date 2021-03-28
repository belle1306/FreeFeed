<template>
  <div>
    <message-box v-for="message in taggedMessages" :key="message.signature" :message="message" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { mainStore } from '~/store'
import { Message } from '~/types/Message'
import MessageBox from '~/components/MessageBox.vue'

@Component
export default class TagIndex extends Vue {
  // DATA
  transactions = []

  // LIFECYCLE
  mounted() {
    mainStore.getTransactions();
    mainStore.setHashtag(this.$route.params.name);
  }

  // COMPUTED
  // return stored messages
  get taggedMessages(): Array<Message> {
    return mainStore.taggedMessages;
  }
}
</script>