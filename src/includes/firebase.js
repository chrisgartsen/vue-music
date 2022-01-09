import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyD6CVFGyZF-VMBiKmYlVBHo9VOKZId7sYA',
  authDomain: 'music-ad829.firebaseapp.com',
  projectId: 'music-ad829',
  storageBucket: 'music-ad829.appspot.com',
  messagingSenderId: '499030741037',
  appId: '1:499030741037:web:84bc22e3db35a8b7f6a8a4'
}

firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()
const db = firebase.firestore()
const storage = firebase.storage()

const usersCollection = db.collection('users')
const songsCollection = db.collection('songs')
const commentsCollection = db.collection('comments')

export {
  auth,
  db,
  usersCollection,
  songsCollection,
  commentsCollection,
  storage
}
