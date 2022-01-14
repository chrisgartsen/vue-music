import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VeeValidatePlugin from './includes/validation'

import { auth } from './includes/firebase'
import './assets/tailwind.css'
import './assets/main.css'

import icon from './directives/icon'

let app

auth.onAuthStateChanged(() => {
  if (!app) {
    console.log('Initialising app.')
    app = createApp(App)

    app.use(store)
    app.use(router)
    app.use(VeeValidatePlugin)
    app.directive('icon', icon)

    app.mount('#app')
  }
})
