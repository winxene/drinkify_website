import React from 'react';
import qrcode from 'qrcode';
import Image from 'next/image'
import CopyToClipboard from 'copy-to-clipboard';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { initializeApp } from 'firebase/app' // no compat for new SDK
import { getDatabase, onValue, ref, update } from 'firebase/database'
import drinkifyPic from '../assets/drinkify_logo.png';

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
    <div className="flex justify-center items-center h-screen p-screen bg-black flex-col">
      <Image className= "h-48 w-96" src ={drinkifyPic} alt ="Drinkify Logo" />
      <button onClick={generateQRCode}>Generate QR code</button>
      {showQRCode && qrCodeUrl ? <img src={qrCodeUrl} className='h-64 w-64 m-4 rounded-full '/> :
        <p className="text-sm text-white break-words m-5">QR code will be shown here</p>
      }
      {
       showQRCode && qrCodeUrl? <button onClick={toggleShowTokenString} className= "m-6"> show token string </button> : null 
      }
      { showTokenString && (
        <div className = "d-flex align-items-center mx-16">
          <p className= "text-white mr-2">{token} 
          <button className= "ml-2" onClick={copyTokenStringToClipboard}><ContentCopyIcon></ContentCopyIcon></button>
          </p>
        </div>
      )}
    <p className='text-white font-bold'>Created by:</p>
      <p className= 'text-white'>Vincent, Vendy, and Winxen</p>
    </div>
  );
}

export default HomePage;
