import React, { useState, useRef, useEffect } from 'react';

import './app.css';

const App = () => {
  const [inputValue, setInputValue] = useState('');
  const [leftBoxContent, setLeftBoxContent] = useState([]);
  const [rightBoxContent, setRightBoxContent] = useState([]);

  const webSocketRef = useRef(null);

  const leftBoxContentRef = useRef([]);
  leftBoxContentRef.current = leftBoxContent;

  const rightBoxContentRef = useRef([]);
  rightBoxContentRef.current = rightBoxContent;

  const inputRef = React.createRef();

  useEffect(() => {
    webSocketRef.current = new WebSocket('wss://ws.postman-echo.com/raw');

    webSocketRef.current.addEventListener('message', handleReceiveMessage);

    return () => {
      webSocketRef.current.close();
    };
  }, []);

  const sendMessage = () => {
    if (inputValue.length === 0) {
      return;
    }
  
    if (webSocketRef.current?.readyState === WebSocket.OPEN) {
      webSocketRef.current.send(inputValue);
  
      setInputValue('');
      inputRef.current.focus();
    } else {
      console.log('Connection is not open.');
    }
  }

  const handleButtonClick = () => {
    sendMessage();
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  }

  const handleChangeMessage = (e) => {
    setInputValue(e.target.value);
  }

  const handleReceiveMessage = (event) => {
    const message = event.data;

    const firstChar = message.charAt(0);

    if (/^[A-Z]$/.test(firstChar)) {
      setLeftBoxContent([...leftBoxContentRef.current, message]);
    } else {
      setRightBoxContent([...rightBoxContentRef.current, message]);
    }
  }

  const mapMessages = (el, i) => (
    <div key={i}>{el}</div>
  );

  return (
    <div className='container'>
      <div className='flexBlock'>
        <div className='box'>{leftBoxContent.map(mapMessages)}</div>
        <div className='box'>{rightBoxContent.map(mapMessages)}</div>
      </div>
      <div className='flexBlock'>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleChangeMessage}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleButtonClick}>Send</button>
      </div>
    </div>
  );
}

export default App;
