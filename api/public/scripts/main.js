const quotes = document.getElementById('quotes');
const error = document.getElementById('error');

const firebaseConfig = {
    apiKey: "AIzaSyAJwRp-LjGZrZsowSdht77Bwx1iOtqUS5Q",
    authDomain: "routine-6ab7c.firebaseapp.com",
    projectId: "routine-6ab7c",
    storageBucket: "routine-6ab7c.appspot.com",
    messagingSenderId: "220002943117",
    appId: "1:220002943117:web:2b1c0584d53dd38c7ee2c4",
    measurementId: "G-QPCV71547T"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

const displayQuotes = (allQuotes) => {
  let html = '';
  for (const quote of allQuotes) {
    html += `<blockquote class="wp-block-quote">
                <p>${quote.quote}. </p><cite>${quote.character}</cite>
            </blockquote>`;
  }
  return html;
};
