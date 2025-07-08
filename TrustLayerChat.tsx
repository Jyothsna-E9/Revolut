import React, { useEffect, useRef, useState } from 'react';

const distressKeywords = ['scam', 'fraud', 'panic', 'stolen'];
const callbackTimes = ['10:00 AM', '11:30 AM', '2:00 PM'];

type Message = {
  text: string;
  sender: 'user' | 'bot';
};

const styles: { [key: string]: React.CSSProperties } = {
  body: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f5f8fa',
    color: '#1a1a1a',
    fontSize: 18,
    lineHeight: 1.6,
    padding: 20,
    maxWidth: 800,
    margin: 'auto',
  },
  chatBox: {
    background: '#fff',
    border: '1px solid #ccc',
    borderRadius: 8,
    padding: 20,
    height: 400,
    overflowY: 'auto' as const,
    marginBottom: 10,
  },
  message: {
    margin: '10px 0',
  },
  user: {
    textAlign: 'right' as const,
    color: '#0a7cff',
  },
  bot: {
    textAlign: 'left' as const,
    color: '#333',
  },
  input: {
    padding: 10,
    fontSize: 16,
    marginTop: 5,
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  button: {
    padding: 10,
    fontSize: 16,
    marginTop: 5,
    marginRight: 8,
  },
  callbackOptions: {
    display: 'block',
    marginTop: 10,
  },
  speakBtn: {
    position: 'fixed' as const,
    bottom: 20,
    right: 20,
    background: '#0a7cff',
    color: 'white',
    padding: '14px 18px',
    border: 'none',
    borderRadius: 50,
    cursor: 'pointer',
    fontSize: 16,
  },
};

export const TrustLayerChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [showCallback, setShowCallback] = useState(false);
  const [scheduleTime, setScheduleTime] = useState(callbackTimes[0]);
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

  const displayMessage = (text: string, sender: 'user' | 'bot' = 'bot') => {
    setMessages((prev) => [...prev, { text, sender }]);
  };

  const processInput = (msg: string) => {
    const triggered = distressKeywords.some((word) => msg.includes(word));
    if (triggered) {
      displayMessage("Don't worry, you're not alone. A real person is reviewing this now. Estimated wait: 3 minutes.");
      displayMessage('✅ Agent connected: Anna – Scam Specialist');
      setShowCallback(true);
    } else {
      displayMessage('Thanks for your message. A support agent will respond soon.');
    }
    if (msg.includes('chargeback')) {
      displayMessage('🛈 Tip: A chargeback is when a transaction is reversed due to a reported issue with a payment.');
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
      displayMessage('📞 Anna will call you shortly...');
    } else {
      displayMessage(`📅 Callback scheduled at ${scheduleTime}`);
    }
  };

  const connectToHuman = () => {
    displayMessage("You've been connected to a human agent. Anna will assist you shortly.");
    setShowCallback(true);
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
        />
      </form>
      {showCallback && (
        <div id="callback-options" style={styles.callbackOptions}>
          <p>Would you prefer a call?</p>
          <button
            type="button"
            style={styles.button}
            onClick={() => respond('Call me now')}
          >
            📞 Call Me Now
          </button>
          <button
            type="button"
            style={styles.button}
            onClick={() => respond('Schedule callback')}
          >
            📅 Schedule a Callback
          </button>
          <select
            id="schedule-time"
            value={scheduleTime}
            onChange={(e) => setScheduleTime(e.target.value)}
            style={styles.button}
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
      >
        💬 Speak to a Human
      </button>
    </div>
  );
};

export default TrustLayerChat;
