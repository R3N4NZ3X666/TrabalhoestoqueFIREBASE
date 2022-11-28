/********************************************** 
* Renomeie este arquivo para firebase.js!
***********************************************/

// Cole as informações do seu RealTime Database do Firebase abaixo:
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAGCbsEEOOxGtHdO3KgZ7F57Mv24EFObeU",
  authDomain: "pifatecitu-b4fd1.firebaseapp.com",
  databaseURL: "https://pifatecitu-b4fd1-default-rtdb.firebaseio.com",
  projectId: "pifatecitu-b4fd1",
  storageBucket: "pifatecitu-b4fd1.appspot.com",
  messagingSenderId: "1010314273353",
  appId: "1:1010314273353:web:88571e9819879a686b5598",
  measurementId: "G-PRGQS87VQN"
};

firebase.initializeApp(firebaseConfig)
var database = firebase.database()
