<template>
  <div>
    <v-card outlined class="mb-3">
      <v-card-text class="message">
        <v-row class="mb-1">
          <!-- author address -->
          <v-col>
            <span @click="goToAddress(message.senderAddress)" class="font-weight-bold address">@{{ message.senderAddress }}</span>
          </v-col>
          <!-- transaction amount  -->
          <v-col class="text-right">
            <v-tooltip left v-if="message.amount">
              <template v-slot:activator="{ on, attrs }">
                <v-avatar size="20" v-bind="attrs" v-on="on">
                  <img :src="require('@/static/symbol-purple-orange.png')">
                </v-avatar>
              </template>
              <span>{{ message.amount }} XYM</span>
            </v-tooltip>
          </v-col>
        </v-row>

        <!-- message body -->
        <span v-for="(word, index) in messageWords" :key="index" class="pr-1 text-center">
          <br v-if="isLineBreak(word)" />
          <span v-else-if="isHashtag(word)" plain @click="goToHashtag(word)" class="tag">{{ word }}</span>              
          <span v-else>{{ word }}</span>
        </span>

        <!-- comments section -->
        <div class="text-right mt-5">
          <!-- show comments -->      
          <v-tooltip top v-if="hasComments(message.signature)">
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" v-bind="attrs" v-on="on" @click="toggleComments()" class="pointer">mdi-comment-text-outline</v-icon>
            </template>
            <span>{{ showComments ? 'Hide comments' : 'Show comments' }}</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="primary" @click="openAddCommentDialog()" v-bind="attrs" v-on="on">mdi-comment-plus-outline</v-icon>
            </template>
            <span>Add comment</span>
          </v-tooltip>
        </div>

        <!-- comments -->
        <div v-show="showComments" class="mt-3">
          <comment-box v-for="message in getCommentsToMessage(message.signature)" :key="message.signature" :comment="message" />
        </div>
      </v-card-text>
    </v-card>

    <!-- DIALOGS -->
    <v-dialog v-model="dialog" persistent max-width="600">
      <v-card>
        <v-card-title class="headline primary white--text">Add comment</v-card-title>
        <v-card-text>
          <v-container class="title text-center">
            <div class="pt-3">
              To add comment type you message below
              <v-textarea v-model="newComment" outlined counter maxlength="900" label="Your comment..." class="mt-3"></v-textarea>
              Now log in to your Symbol wallet and transfer any amount (can be 0) to this
              <v-btn small outlined color="primary" @click="copyAccountAddress()" class="text-lowercase">
                {{ addressCopied ? 'copied' : 'address' }}
                <v-icon right dark>{{ addressCopied ? 'mdi-check-bold' : 'mdi-content-copy' }}</v-icon>
              </v-btn>
              with an attached specially
              <v-btn small outlined color="primary" @click="copyPreparedMessage()" class="text-lowercase">
                {{ messageCopied ? 'message copied' : 'prepared message' }}
                <v-icon right dark>{{ messageCopied ? 'mdi-check-bold' : 'mdi-content-copy' }}</v-icon>
              </v-btn>
            </div>
          </v-container>
        </v-card-text>
        <v-card-actions>              
          <v-spacer></v-spacer>
          <v-btn color="primary"  @click="closeAddCommentDialog()">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { mainStore } from '~/store'
import { Message } from '~/types/Message'
import Utils from '~/utils/utils'

@Component
export default class MessageBox extends Vue {
  // DATA
  dialog: boolean = false
  newComment: string = ''
  showComments: boolean = false
  addressCopied: boolean = false
  messageCopied: boolean = false

  // PROPS
  @Prop() message!: Message

  // METHODS
  // check if word is hashtag
  isHashtag(value: string): boolean {
    if (value) {
      return value.charAt(0) === '#' ? true : false;
    } else {
      return false;
    }
  }

  // check if word is line break
  isLineBreak(value: string): boolean {
    if (value) {
      return value === '<br>' ? true : false;
    } else {
      return false;
    }
  }

  removeHashFromHashtag(hashtag: string): string {
    return hashtag.substring(1);
  }

  goToHashtag(tag: string): void {
    mainStore.setTryGetCachedTransactions(true);
    this.$router.push(`/tag/${this.removeHashFromHashtag(tag)}`);
  }

  goToAddress(address: string): void {
    mainStore.setTryGetCachedTransactions(true);
    this.$router.push(`/address/${address}`);
  }

  getCommentsToMessage(signature: string): Array<Message> {
    return mainStore.comments.filter(c => c.toMessageSignature === signature);
  }

  hasComments(signature: string): boolean {
    return mainStore.comments.filter(c => c.toMessageSignature === signature).length > 0; 
  }

  toggleComments() {
    this.showComments = !this.showComments;
  }

  openAddCommentDialog() {
    this.dialog = true;
  }

  closeAddCommentDialog() {
    this.dialog = false;
    this.newComment = '';
    this.addressCopied = false;
    this.messageCopied = false;
  }

  // METHODS
  async copyAccountAddress() {
    navigator.clipboard.writeText(this.accountAddress);
    this.addressCopied = true;
  }
  
  async copyPreparedMessage() {
    const msg: string = `$${this.message.signature} ${this.newComment}`;
    navigator.clipboard.writeText(msg);
    this.messageCopied = true;
  }

  // COMPUTED
  get messageWords() {
    return Utils.textWords(this.message.text);
  }

  // get main account address
  get accountAddress(): string {
    return mainStore.accountAddress;
  }
}
</script>

<style>
.message {
  /* border-left: 3px solid #28002e !important; */
  border-left: 3px solid #581798 !important;
}

.tag {
  cursor: pointer;
  text-decoration: underline;
}

.address, .pointer {
  cursor: pointer;
}
</style>