```tsx
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useEffect, useRef, useState } from 'react';

const callbackTimes = ['ASAP', 'In 10 minutes', 'In 30 minutes', 'At a specific time'];

const distressKeywords = ['help', 'scam', 'chargeback', 'fraud', 'dispute'];

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const styles = {
  body: css`
    display: flex;
    flex-direction: column;
    height: 100vh;
    max-width: 600px;
    margin: 0 auto;
    padding: 0 20px;
    font-family: Arial, sans-serif;
    background-color: #f4f4f9;
  `,
  chatBox: css`
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  `,
  message: css`
    padding: 10px;
    margin: 5px 0;
    border-radius: 8px;
    max-width: 80%;
    position: relative;
  `,
  user: css`
    align-self: flex-end;
    background-color: #dcf8c6;
    border: 1px solid #b2dba1;
  `,
  bot: css`
    align-self: flex-start;
    background-color: #f1f0f0;
    border: 1px solid #d1d1d1;
  `,
  input: css`
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin-top: 10px;
    width: calc(100% - 22px);
  `,
  button: css`
    padding: 10px;
    border: none;
    border-radius: 8px;
    margin-top: 10px;
    cursor: pointer;
    font-weight: bold;
    width: 100%;
  `,
  speakBtn: css`
    background-color: #007bff;
    color: white;
    &:hover {
      background-color: #0056b3;
    }
  `,
  callbackOptions: css`
    margin-top: 10px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #fff;
  `,
};

export const TrustLayerChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [showCallback, setShowCallback] = useState(false);
  const [scheduleTime, setScheduleTime] = useState(callbackTimes[0]);
  const [isTyping, setIsTyping] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const history = localStorage.getItem('chatHistory');
    if (history) {
      setMessages(JSON.parse(history));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const displayMessage = (text: string, sender: 'user' | 'bot' = 'bot', delay = 0) => {
    if (sender === 'bot' && delay > 0) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages((prev) => [...prev, { text, sender }]);
        setIsTyping(false);
      }, delay);
    } else {
      setMessages((prev) => [...prev, { text, sender }]);
    }
  };

  const processInput = (msg: string) => {
    const triggered = distressKeywords.some((word) => msg.includes(word));
    if (triggered) {
      displayMessage("Don't worry, you're not alone. A real person is reviewing this now. Estimated wait: 3 minutes.", 'bot', 800);
      displayMessage('✅ Agent connected: Anna – Scam Specialist', 'bot', 1800);
      setTimeout(() => setShowCallback(true), 2000);
    } else {
      displayMessage('Thanks for your message. A support agent will respond soon.', 'bot', 1000);
    }
    if (msg.includes('chargeback')) {
      displayMessage('🛈 Tip: A chargeback is when a transaction is reversed due to a reported issue with a payment.', 'bot', 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = input.trim();
    if (!msg) return;
    displayMessage(msg, 'user');
    setInput('');
    processInput(msg.toLowerCase());
  };

  const respond = (type: 'Call me now' | 'Schedule callback') => {
    if (type === 'Call me now') {
      displayMessage('📞 Anna will call you shortly...', 'bot', 1000);
    } else {
      displayMessage(`📅 Callback scheduled at ${scheduleTime}`, 'bot', 1000);
    }
  };

  const connectToHuman = () => {
    displayMessage("You've been connected to a human agent. Anna will assist you shortly.", 'bot', 800);
    setTimeout(() => setShowCallback(true), 1200);
  };

  return (
    <div style={styles.body} className="calm-mode">
      <h2>Revolut Support – Human Trust Layer</h2>
      <div id="chat-box" style={styles.chatBox} ref={chatBoxRef}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message ${msg.sender}`}
            style={{ ...styles.message, ...(msg.sender === 'user' ? styles.user : styles.bot) }}
          >
            {msg.text}
          </div>
        ))}
        {isTyping && (
          <div className="message bot" style={{ ...styles.message, ...styles.bot, fontStyle: 'italic', opacity: 0.7 }}>
            Anna is typing…
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="input-box"
          placeholder="Type your message…"
          autoComplete="off"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.input}
          disabled={isTyping}
        />
      </form>
      {showCallback && (
        <div id="callback-options" style={styles.callbackOptions}>
          <p>Would you prefer a call?</p>
          <button
            type="button"
            style={styles.button}
            onClick={() => respond('Call me now')}
            disabled={isTyping}
          >
            📞 Call Me Now
          </button>
          <button
            type="button"
            style={styles.button}
            onClick={() => respond('Schedule callback')}
            disabled={isTyping}
          >
            📅 Schedule a Callback
          </button>
          <select
            id="schedule-time"
            value={scheduleTime}
            onChange={(e) => setScheduleTime(e.target.value)}
            style={styles.button}
            disabled={isTyping}
          >
            {callbackTimes.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
      )}
      <button
        id="speak-btn"
        style={styles.speakBtn}
        type="button"
        onClick={connectToHuman}
        disabled={isTyping}
      >
        💬 Speak to a Human
      </button>
    </div>
  );
};
```