<template>
  <div>
    <message-box v-for="message in messages" :key="message.signature" :message="message" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Address, RepositoryFactoryHttp, TransactionGroup } from 'symbol-sdk'
// import _ from 'lodash'
import { mainStore } from '~/store'
import { Message } from '~/types/Message'
import MessageBox from '~/components/MessageBox.vue'

@Component
export default class Index extends Vue {
  // LIFECYCLE
  mounted() {
    mainStore.getTransactions();
  }

  // COMPUTED
  // return stored messages
  get messages(): Array<Message> {
    return mainStore.messages;
  }
}
</script>
