<template>
  <v-dialog v-model="dialog" persistent max-width="600">
    <template v-slot:activator="{ on, attrs }">
      <v-btn outlined color="white" v-bind="attrs" v-on="on">Publish message</v-btn>
    </template>

    <v-card>
      <v-card-title class="headline primary white--text">Publish message</v-card-title>
      <v-card-text>
        <v-container class="title text-center">
          <div class="pt-5">
            To publish new message log in to your Symbol wallet and transfer any amount (can be 0) to this
            <v-btn small outlined color="primary" @click="copyAccountAddress()" class="text-lowercase">
              {{ addressCopied ? 'copied' : 'address' }}
              <v-icon right dark>{{ addressCopied ? 'mdi-check-bold' : 'mdi-content-copy' }}</v-icon>
            </v-btn>
            with an attached <span class="font-weight-bold text-decoration-underline">uncrypted</span> message
          </div>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="dialog = false; addressCopied = false;">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { mainStore } from '~/store'

@Component
export default class SendMessageBtn extends Vue {
  // DATA
  dialog: boolean = false
  addressCopied: boolean = false

  mounted() {
    this.addressCopied = false;
  }

  // METHODS
  async copyAccountAddress() {
    navigator.clipboard.writeText(this.accountAddress);
    this.addressCopied = true;
  }
  
  // COMPUTED
  // get main account address
  get accountAddress(): string {
    return mainStore.accountAddress;
  }
}
</script>