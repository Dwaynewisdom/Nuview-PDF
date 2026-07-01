import React, { useState, useRef } from 'react';

function CustomFileSelector() {
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    // Open the hidden file selection dialog
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Hidden native input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Fully customizable UI button */}
      <button 
        type="button"
        onClick={handleButtonClick}
        style={{
          padding: '10px 20px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Upload Document
      </button>

      {fileName && <p style={{ marginTop: '10px' }}>Selected: {fileName}</p>}
    </div>
  );
}

export default CustomFileSelector;
