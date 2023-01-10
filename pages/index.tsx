import React from 'react';
import qrcode from 'qrcode';
import CopyToClipboard from 'copy-to-clipboard';
import {IconButton} from '@material-ui/core';
import CopyIcon from '@material-ui/core/Icon/Icon';
import { initializeApp } from 'firebase/app' // no compat for new SDK
import { getDatabase, ref, set, update } from 'firebase/database'

const HomePage = () => {
  const [qrCodeUrl, setQRCodeUrl] = React.useState(null);
  const [showQRCode, setShowQRCode] = React.useState(true);
  const [showTokenString, setShowTokenString] = React.useState(false);
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
  });
};
  return (
    <div className="flex justify-center items-center h-screen p-4">
      <button onClick={generateQRCode}>Generate QR code</button>
      {showQRCode && qrCodeUrl ? <img src={qrCodeUrl} /> : <p>QR code will be shown here</p>}
      <button onClick={() => setShowTokenString(!showTokenString)}> show token string </button>
      { showTokenString && (
        <div>
        <p>{tokenStringData}</p>
        <IconButton onClick={() => CopyToClipboard(tokenStringData)}><CopyIcon /></IconButton>
        </div>
      )}
    </div>
  );
}

export default HomePage;
