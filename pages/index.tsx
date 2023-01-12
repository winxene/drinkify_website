import React from 'react';
import qrcode from 'qrcode';
import CopyToClipboard from 'copy-to-clipboard';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { initializeApp } from 'firebase/app' // no compat for new SDK
import { getDatabase, onValue, ref, update } from 'firebase/database'

const HomePage = () => {
  const [qrCodeUrl, setQRCodeUrl] = React.useState(null);
  const [showQRCode, setShowQRCode] = React.useState(true);
  const [showTokenString, setShowTokenString] = React.useState(false);
  const [token, setTokenString] = React.useState('');
  
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
  const firebaseConfig = require('../config/firebaseConfig.ts');
  const app = initializeApp(firebaseConfig);
  const drinkifyDatabase = getDatabase(app);  
  const drinkifyTokenRef = ref(drinkifyDatabase, '/balanceToken');
  const drinkifyTokenReadRef = ref(drinkifyDatabase, '/balanceToken/5k');
  const generateQRCode = () => {
    qrcode.toDataURL(tokenStringData).then(qrCodeUrl => {
      setQRCodeUrl(qrCodeUrl);
      update(drinkifyTokenRef, {
        "5k": tokenStringData
    });
    setShowQRCode(true);
    setTimeout(() => {
      setShowQRCode(false);
    }, 30000);
  });};
  
  const getTokenString = () => {
    onValue(drinkifyTokenReadRef, (snapshot) => {
      if(snapshot.exists()){
      setTokenString(snapshot.val()); 
      }
      else {
        console.log("No data Available");
      }
    });
  }
  
  const toggleShowTokenString = () =>{
    setShowTokenString(!showTokenString)
    getTokenString();
  };
  
  const copyTokenStringToClipboard = () => {CopyToClipboard(token)};
  return (
    <div className="flex justify-center items-center h-screen p-4 bg-black flex-col">
      <button onClick={generateQRCode}>Generate QR code</button>
      {showQRCode && qrCodeUrl ? <img src={qrCodeUrl} /> : <p className="text-sm text-white break-words">QR code will be shown here</p>}
      <button onClick={toggleShowTokenString}> show token string </button>
      { showTokenString && (
        <div className = "d-flex align-items-center">
          <p className= "text-white mr-2">{token} 
          <button onClick={copyTokenStringToClipboard}><ContentCopyIcon></ContentCopyIcon></button>
          </p>
        </div>
      )}
    </div>
  );
}

export default HomePage;
