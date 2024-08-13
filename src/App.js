import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState(""); // State to handle user input
  const [tempInput, setTempInput] = useState(""); // Temporary state for input text
  const [size, setSize] = useState(200); // Size of the QR code
  const [bgColor, setBgColor] = useState("ffffff"); // Background color of the QR code
  const [fgColor, setFgColor] = useState("000000"); // Foreground (QR code) color
  const [qrCode, setQrCode] = useState(""); // URL of the generated QR code
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    if (input) {
      setLoading(true);
      setError(null);
      const url = `http://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(input)}&size=${size}x${size}&bgcolor=${bgColor}&color=${fgColor}`;
      fetch(url)
        .then(response => {
          if (!response.ok) throw new Error('Failed to generate QR code');
          setQrCode(url);
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [input, size, bgColor, fgColor]);

  function handleGenerateClick() {
    if (tempInput.trim()) {
      setInput(tempInput.trim());
    } else {
      setError("Input cannot be empty.");
    }
  }

  function handleReset() {
    setTempInput("");
    setInput("");
    setSize(200);
    setBgColor("ffffff");
    setFgColor("000000");
    setQrCode("");
    setError(null);
  }

  return (
    <div className="App">
      <h1>QR Code Generator</h1>
      <div className="input-box">
        <div className="gen">
          <input 
            type="text" 
            value={tempInput}
            onChange={(e) => setTempInput(e.target.value)}
            placeholder="Enter text or URL to encode" 
          />
          <div className="button-group">
            <button 
              className="button" 
              onClick={handleGenerateClick}
            >
              Generate
            </button>
            <button 
              className="button reset" 
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>
        <div className="extra">
          <div className="color-size">
            <div>
              <h5>Background Color:</h5>
              <input 
                type="color" 
                value={`#${bgColor}`} 
                onChange={(e) => setBgColor(e.target.value.substring(1))} 
              />
            </div>
            <div>
              <h5>Foreground Color:</h5>
              <input 
                type="color" 
                value={`#${fgColor}`} 
                onChange={(e) => setFgColor(e.target.value.substring(1))} 
              />
            </div>
            <div>
              <h5>Dimension:</h5>
              <input 
                type="range" 
                min="200" 
                max="600"
                value={size} 
                onChange={(e) => setSize(e.target.value)} 
              />
              <span>{size} x {size}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="output-box">
        {loading && <div className="loader">Generating...</div>}
        {error && <div className="error">{error}</div>}
        {qrCode && <img src={qrCode} alt="QR Code" />}
        {qrCode && 
          <a href={qrCode} download="QRCode">
            <button type="button" className="download-button">Download</button>
          </a>
        }
      </div>
    </div>
  );
}

export default App;
