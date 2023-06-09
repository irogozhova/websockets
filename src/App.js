import React, { useState, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';

import './app.css';

const App = () => {
  const [inputValue, setInputValue] = useState('');
  const [leftBoxContext, setLeftBoxContent] = useState([]);
  const [rightBoxContext, setRightBoxContent] = useState([]);

  const { sendMessage, lastMessage, readyState } = useWebSocket('wss://ws.postman-echo.com/raw');

  useEffect(() => {
    if (lastMessage !== null) {
      const { data } = lastMessage;

      const firstChar = data.charAt(0);

      if (/^[A-Z]$/.test(firstChar)) {
        setLeftBoxContent([...leftBoxContext, data]);
      } else {
        setRightBoxContent([...rightBoxContext, data]);
      }
    }
  }, [lastMessage]);

  const handleSendRequest = () => {
    if (readyState === 0) {
      return;
    }

    sendMessage(inputValue);
  }

  const handleMsgChange = (e) => {
    setInputValue(e.target.value);
  }

  return (
    <div className='container'>
      <div className='flexBlock'>
        <div className='box'>{leftBoxContext.map((el, i) => (<div key={i}>{el}</div>))}</div>
        <div className='box'>{rightBoxContext.map((el, i) => (<div key={i}>{el}</div>))}</div>
      </div>
      <div className='flexBlock'>
        <input type="text" value={inputValue} onChange={handleMsgChange} />
        <button onClick={handleSendRequest}>Send</button>
      </div>
    </div>
  );
}

export default App;
