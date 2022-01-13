import { createStore } from 'vuex'
import { auth, usersCollection } from '@/includes/firebase'
import { Howl } from 'howler'

import helper from '@/includes/helper'

export default createStore({
  state: {
    authModalShow: false,
    userLoggedIn: false,
    currentSong: {},
    sound: {},
    seek: '00:00',
    duration: '00:00',
    playerProgress: '0%'
  },
  getters: {
    authModalShow(state) {
      return state.authModalShow
    },
    playing(state) {
      if(state.sound.playing) {
        return state.sound.playing()
      } else {
        return false
      }
    }
  },
  mutations: {
    toggleAuthModal(state) {
      state.authModalShow = !state.authModalShow
    },
    toggleAuthentication(state) {
      state.userLoggedIn = !state.userLoggedIn
    },
    newSong(state, payload) {
      state.currentSong = payload
      state.sound = new Howl({
        src: [payload.url],
        html5: true
      })
    },
    updatePosition(state) {
      state.seek = helper.formatTime(state.sound.seek())
      state.duration = helper.formatTime(state.sound.duration())
      state.playerProgress = `${(state.sound.seek() / state.sound.duration()) * 100}%`
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
    },
    async newSong({ commit, state, dispatch }, payload) {
      if(state.sound instanceof Howl) {
        state.sound.unload()
      }

      commit('newSong', payload)
      state.sound.play()

      state.sound.on('play', () =>{
        requestAnimationFrame(() => {
          dispatch('progress')
        })
      })
    },
    progress({ commit, state, dispatch }) {
      commit('updatePosition')
      if(state.sound.playing()) {
        requestAnimationFrame(()=> {
          dispatch('progress')
        })
      }
    },
    updateSeek({ state, dispatch }, payload){ // event object passed as payload
      if(!state.sound.playing) {
        return
      }

      //console.log(payload)


      const { x, width } = payload.currentTarget.getBoundingClientRect()
      const clickX = payload.clientX - x
      const percentage = clickX / width
      const seconds = state.sound.duration() * percentage

      state.sound.seek(seconds)
      state.sound.once('seek', () => {
        dispatch('progress')
      })
    },
    async toggleAudio({ state }) {
      if(!state.sound.playing) {
        return
      }

      if(state.sound.playing()) {
        state.sound.pause()
      } else {
        state.sound.play()
      }
    }
  }
})
