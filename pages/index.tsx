import qrcode from 'qrcode';
import React from 'react';

const HomePage = () => {
  const [qrCodeUrl, setQRCodeUrl] = React.useState(null);

  const generateQRCode = () => {
    const data = Math.random().toString(36).substring(7);
    qrcode.toDataURL(data).then(qrCodeUrl => setQRCodeUrl(qrCodeUrl));
  }

  return (
    <div className="flex justify-center items-center h-screen p-4">
      <button onClick={generateQRCode}>Generate QR code</button>
      {qrCodeUrl ? <img src={qrCodeUrl} /> : <p>Loading QR code...</p>}
    </div>
  );
};

export default HomePage;
