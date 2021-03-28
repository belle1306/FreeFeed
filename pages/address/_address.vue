<template>
  <div>
    <message-box v-for="message in messages" :key="message.signature" :message="message" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { mainStore } from '~/store'
import { Message } from '~/types/Message'
import MessageBox from '~/components/MessageBox.vue'

@Component
export default class AddressIndex extends Vue {
  // DATA
  transactions = []

  // LIFECYCLE
  mounted() {    
    mainStore.getTransactions();
    mainStore.setAddress(this.$route.params.address);
  }

  // COMPUTED
  // return stored messages
  get messages(): Array<Message> {
    return mainStore.messagesFromAddress;
  }
}
</script>