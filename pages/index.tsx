import React from 'react';
import qrcode from 'qrcode';
import { initializeApp } from 'firebase/app' // no compat for new SDK
import { getDatabase, ref, set, update } from 'firebase/database'

const HomePage = () => {
  const [qrCodeUrl, setQRCodeUrl] = React.useState(null);
  //randomize 16 string
  function generateString(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const tokenStringData = generateString(16);
  const firebaseConfig = {
      // Your Firebase configuration here
        apiKey: "AIzaSyByAJxUcwo5ldPwnGNHLrIkPSPioihwVZ4",
        authDomain: "drinkify-firebase.firebaseapp.com",
        databaseURL: "https://drinkify-firebase-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "drinkify-firebase",
        storageBucket: "drinkify-firebase.appspot.com",
        messagingSenderId: "963701895505",
        appId: "1:963701895505:web:cf7cb4440df731541da370",
        measurementId: "G-G4VQZ01XGP"
    };
  const app = initializeApp(firebaseConfig);
  const drinkifyDatabase = getDatabase(app);  
  const drinkifyTokenRef = ref(drinkifyDatabase, '/balanceToken');
  const generateQRCode = () => {
    qrcode.toDataURL(tokenStringData).then(qrCodeUrl => {
      setQRCodeUrl(qrCodeUrl);
      update(drinkifyTokenRef, {
        "5k": tokenStringData
    });
  });
};
  return (
    <div className="flex justify-center items-center h-screen p-4">
      <button onClick={generateQRCode}>Generate QR code</button>
      {qrCodeUrl ? <img src={qrCodeUrl} /> : <p>Loading QR code...</p>}
    </div>
  );
}

export default HomePage;
