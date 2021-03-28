<template>
  <v-card outlined class="mb-3">
    <v-card-text class="comment">
      <v-row class="mb-1">
        <!-- author address -->
        <v-col>
          <span @click="goToAddress(comment.senderAddress)" class="font-weight-bold address">@{{ comment.senderAddress }}</span>
        </v-col>
        <!-- transaction amount  -->
        <v-col class="text-right">
          <v-tooltip left v-if="comment.amount">
            <template v-slot:activator="{ on, attrs }">
              <v-avatar size="20" v-bind="attrs" v-on="on">
                <img :src="require('@/static/symbol-purple-orange.png')">
              </v-avatar>
            </template>
            <span>{{ comment.amount }} XYM</span>
          </v-tooltip>
        </v-col>
      </v-row>

      <span v-for="(word, index) in commentWords" :key="index" class="pr-1 text-center">        
        <span v-if="index > 0 && isHashtag(word)" plain @click="goToHashtag(word)" class="tag">{{ word }}</span>        
        <span v-else-if="index > 0">{{ word }}</span>
      </span>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { mainStore } from '~/store'
import { Message } from '~/types/Message'
import Utils from '~/utils/utils'

@Component
export default class CommentBox extends Vue {
  // PROPS
  @Prop() comment!: Message

  // METHODS
  // check if word is hashtag
  isHashtag(value: string): boolean {
    if (value) {
      return value.charAt(0) === '#' ? true : false;
    } else {
      return false;
    }
  }

  removeHashFromHashtag(hashtag: string): string {
    return hashtag.substring(1);
  }

  goToHashtag(tag: string): void {
    mainStore.setTryGetCachedTransactions(true);
    mainStore.setHashtag(tag);
    this.$router.push(`/tag/${this.removeHashFromHashtag(tag)}`);
  }

  goToAddress(address: string): void {
    mainStore.setTryGetCachedTransactions(true);
    mainStore.setAddress(address);
    this.$router.push(`/address/${address}`);
  }

  // COMPUTED
  get commentWords() {
    return Utils.textWords(this.comment.text);
  }
}
</script>

<style>
.comment {
  /* border-left: 3px solid #28002e !important; */
  border-left: 3px solid orange !important;
}

.tag {
  cursor: pointer;
  text-decoration: underline;
}

.address, .pointer {
  cursor: pointer;
}
</style>