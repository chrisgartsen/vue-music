import { createStore } from 'vuex'
import { auth, usersCollection } from '@/includes/firebase'


export default createStore({
  state: {
    authModalShow: false,
    userLoggedIn: false
  },
  getters: {
    authModalShow(state) {
      return state.authModalShow
    }
  },
  mutations: {
    toggleAuthModal(state) {
      state.authModalShow = !state.authModalShow
    },
    toggleAuthentication(state) {
      state.userLoggedIn = !state.userLoggedIn
    }
  },
  actions: {
    async register({ commit }, values) {
      await auth.createUserWithEmailAndPassword(
        values.email,
        values.password
      )
      await usersCollection.add({
        name: values.name,
        email: values.email,
        age: values.age,
        country: values.country
      })

      commit('toggleAuthentication')
    }
  }
})
