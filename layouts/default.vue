<template>
  <v-app>
    <v-app-bar app absolute color="primary">
        <v-row justify="center" align="center">
          <v-col cols="12" sm="10" md="8">
            <v-row>
              <v-col>
                <v-toolbar-title @click="$router.push('/')" class="title text-h4 pointer">
                  FreeFeed
                </v-toolbar-title>
              </v-col>
              <v-col class="text-right">
                <send-message-btn />
              </v-col>
            </v-row>
          </v-col>
      </v-row>
    </v-app-bar>
    <v-main>
      <v-row justify="center" align="center" class="mt-10">
        <v-col cols="12" sm="8" md="8">
          <div v-show="!isDataLoading">
            <v-row align="center">
              <v-col>
                <!-- <span class="text-decoration-underline">{{ filterTypeText }}</span> -->
                <span v-if="this.$route.name === 'address-address'">
                  <span class="font-weight-bold">{{ filterTypeText }}</span><span>'s messages</span>                  
                </span>
                <span v-else-if="this.$route.name === 'tag-name'">
                  <span class="font-weight-bold">{{ filterTypeText }}</span> <span>tagged messages</span>                  
                </span>
                <span v-else class="font-weight-bold">
                  all messages
                </span>
              </v-col>
            </v-row> 
            <nuxt class="mt-5" />              
          </div>
          <div v-show="isDataLoading">
            <v-progress-linear indeterminate color="primary" />
          </div>
        </v-col>
      </v-row>
    </v-main>
    
    <!-- footer -->
    <v-footer absolute app class="mt-10 pt-5 pb-10 footer">
      <v-row justify="center" align="center">
        <v-col cols="12" sm="10" md="8">
          <v-row justify="center" align="center">
            <v-col class="text-center">
              <div>Created for Symbol Hackaton 2021</div>
              <div class="pt-5">
                <a href="https://symbolplatform.com" target="_blank">
                  <img :src="require('@/static/symbol-logo-white-orange.png')" height="100px" >
                </a>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import SendMessageBtn from '~/components/SendMessageBtn.vue'
import { mainStore } from '~/store'

@Component
export default class Default extends Vue {
  // COMPUTED
  // return data loading status
  get isDataLoading(): boolean {
    return mainStore.isDataLoading;
  }

  get filterTypeText(): string {
    let text: string = '';

    if (this.$route.name === 'tag-name') {
      text = `#${this.$route.params.name}`;
    } else if (this.$route.name === 'address-address') {
      text = `@${this.$route.params.address}`;
    } else {
      text = 'all messages'
    }
    
    return text;
  }

  get filterInfo(): string {
    let text: string = '';

    if (this.$route.name === 'tag-name') {
      text = `#${this.$route.params.name}`;
    } else if (this.$route.name === 'address-address') {
      text = `@${this.$route.params.address}' messages`;
    } else {
      text = 'all messages'
    }
    
    return text;
  }
}
</script>

<style>
/* hide scrollbar but still can scroll */
html {
  -ms-overflow-style: none;  /* IE 10+ */
  overflow: -moz-scrollbars-none;  /* Firefox */
}
html::-webkit-scrollbar {
  display: none; /* Safari and Chrome */
}

</style>

<style scoped>
/* style must be scoped */
.v-application {
  background-color: #F5F5F5;
}

.title {
  color: white;
}

.pointer {
  cursor: pointer;
}

.footer {
  background-color: #581798 !important;
  color: white !important;
}

.link {
  text-decoration: none;
  color: white;
}

.right {
  float: right;
}
</style>