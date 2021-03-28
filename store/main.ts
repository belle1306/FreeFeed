import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import { Address, RepositoryFactoryHttp, Transaction, TransactionGroup, Order, TransactionType } from 'symbol-sdk'
import { Message } from '~/types/Message'
import Utils from '~/utils/utils'

@Module({
  name: 'main',
  stateFactory: true,
  namespaced: true,
})

export default class Main extends VuexModule {
  nodeUrl = 'http://ngl-dual-103.symbolblockchain.io:3000' //testnet: 'http://api-01.us-east-1.0.10.0.x.symboldev.network:3000'
  accountRawAddress = 'NBL6LOVLYU2IKEET4CHFHUQFDMO54HTZEXTRWRI' // testnet:'TADQ3E-5MDGO2-L2S2LW-4E76DE-MZBWFP-TTNRAF-NDA' // bT testnet
  transactions: Array<any> = []
  transactionPageToFetch: number = 1
  dataLoading: boolean = false
  hashtag: string = ''
  address: string = ''
  tryGetCachedTransactions: boolean = false
  messages: Array<Message> = []
  comments: Array<Message> = []
  showAllComments: boolean = false

  // ACTIONS
  @Action({ rawError: true })
  setHashtag(tag: string) {
    this.storeHashtag(tag);
  }

  @Action({ rawError: true })
  setAddress(address: string) {
    this.storeAddress(address);
  }

  @Action({ rawError: true })
  setTryGetCachedTransactions(val: boolean) {
    this.storeTryGetCachedTransactions(val);
  }

  @Action({ rawError: true })
  getTransactions() {
    // get transactions only if not cached
    if (this.tryGetCachedTransactions && this.transactions.length > 0) {
      return
    }

    this.setDataLoading(true);

    const address = Address.createFromRawAddress(this.accountRawAddress);    
    const repositoryFactory = new RepositoryFactoryHttp(this.nodeUrl);
    const transactionHttp = repositoryFactory.createTransactionRepository();

    const searchCriteria = {
      group: TransactionGroup.Confirmed,
      type: [TransactionType.TRANSFER],
      order: Order.Desc,
      address,
      pageNumber: this.transactionPageToFetch,
      pageSize: 10
    };

    transactionHttp.search(searchCriteria).subscribe(
      (page) => { 
        this.storeTransactons(page.data);
        if (!page.isLastPage) {
          this.getTransactions();
        } else {
          this.getMessages();
          this.setDataLoading(false);
        }
      },
      (err) => console.error(err)
    );
  }

  // get messages from transactions
  @Action
  getMessages() {
    let allMessages: Array<Message> = []
    let messages: Array<Message> = []
    let comments: Array<Message> = []
    
    const filteredTxs = this.transactions.filter((tx) => {
      return Object.keys(tx).length !== 0 && (tx.message.type === 0 || tx.message.type === 1);
    });

    // all messags
    allMessages = filteredTxs.map(tx => ({
      signature: tx.signature,
      senderAddress: tx.signer.address.address,
      text: (tx.message.type === 0) ? tx.message.payload : 'ENCRYPTED', 
      amount: tx.mosaics[0].amount.lower / 1000000,
      isComment: tx.message.payload.charAt(0) === '$',
      toMessageSignature: tx.message.payload.charAt(0) === '$'
        ? tx.message.payload.substring(1, tx.message.payload.indexOf(' ')) 
        : null
    }));

    // messages
    messages = allMessages.filter(msg => !msg.isComment);

    // comments
    comments = allMessages.filter(msg => msg.isComment);

    // store messages with comments
    this.storeMessages(messages);
    this.storeComments(comments);
  }

  // MUTATIONS
  @Mutation
  setDataLoading(value: boolean) {
    this.dataLoading = value;
  }

  @Mutation
  storeHashtag(tag: string) {
    this.hashtag = tag;
  }

  @Mutation
  storeAddress(address: string) {
    this.address = address;
  }

  @Mutation
  storeTryGetCachedTransactions(val: boolean) {
    this.tryGetCachedTransactions = val;
  }

  @Mutation
  storeTransactons(transactions: Array<any>) {
    this.transactions = this.transactions.concat(transactions);
    this.transactionPageToFetch++
  }

  @Mutation
  storeMessages(data: Array<Message>) {
    this.messages = data;
  }

  @Mutation
  storeComments(data: Array<Message>) {
    this.comments = data;
  }

  // GETTERS
  // get current address
  get accountAddress() {
    return this.accountRawAddress
  }

  get isDataLoading(): boolean {
    return this.dataLoading;
  }

  // get messages (messages and comments) from transactions
  get allMessages() {
    const filteredTxs = this.transactions.filter((tx) => {
      return Object.keys(tx).length !== 0 && (tx.message.type === 0 || tx.message.type === 1);
    });

    const allMessages: Array<Message> = filteredTxs.map(tx => ({
      signature: tx.signature,
      senderAddress: tx.signer.address.address,
      text: (tx.message.type === 0) ? tx.message.payload : 'ENCRYPTED', 
      amount: tx.mosaics[0].amount.lower / 1000000,
      isComment: tx.message.payload.charAt(0) === '$',
      toMessageSignature: null
    }));

    return allMessages;
  }

  // get messages with tag
  get taggedMessages() {
    const taggedMessages: Array<Message> = this.messages.filter(msg => msg.text.includes(this.hashtag));

    return taggedMessages;
  }

  // get messages sended from address
  get messagesFromAddress() {
    const messagesFromAddress: Array<Message> = this.messages.filter(msg => msg.senderAddress === this.address);

    return messagesFromAddress;
  }
}