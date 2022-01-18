import { auth, usersCollection } from '@/includes/firebase'

export default {
  //namespaced: true,
  state: {
    authModalShow: false,
    userLoggedIn: false
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
      const userCredentials = await auth.createUserWithEmailAndPassword(
        values.email,
        values.password
      )

      await usersCollection.doc(userCredentials.user.uid).set({
        name: values.name,
        email: values.email,
        age: values.age,
        country: values.country
      })

      await userCredentials.user.updateProfile({ displayName: values.name })

      commit('toggleAuthentication')
    },
    async login({ commit }, payload) {
      await auth.signInWithEmailAndPassword(payload.email, payload.password)
      commit('toggleAuthentication')
    },
    async signOut({ commit }) {
      await auth.signOut()
      commit('toggleAuthentication')
    },
    init_login({ commit }) {
      const user = auth.currentUser
      if (user) {
        console.log('Autologin user')
        commit('toggleAuthentication')
      }
    }
  }
}
