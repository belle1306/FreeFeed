import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import Main from '~/store/main'
 
let mainStore: Main
 
function initialiseStores(store: Store<any>): void {
  mainStore = getModule(Main, store)
}
 
export { initialiseStores, mainStore }