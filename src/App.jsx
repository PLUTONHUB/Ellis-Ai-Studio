import { useState } from "react";
import "./App.css";
import { processCommand } from "./services/plutoEngine";
function App() {const [input, setInput] = useState("");

const [messages, setMessages] = useState([
  "Pluto: Ready for your first command."
]);
  return (
    <div className="app">

      <div className="card">

        <h1>PLUTO</h1>

        <p className="subtitle">
          AI Operating System
        </p>

        <div className="status">
          🟢 Online
        </div>

        <div className="chatWindow">

  {messages.map((msg, index) => (
    <div key={index} className="message">
      {msg}
    </div>
  ))}

</div>

       <input
  type="text"
  value={input}
  onChange={(e) => setInput(e.target.value)}
  placeholder="What would you like me to do?"
/>

        <button
  onClick={() => {
    if (!input) return;
    
console.log(processCommand(input));

    setMessages([
      ...messages,
      "You: " + input,
      "Pluto: " + processCommand(input)
    ]);

    setInput("");
  }}
>
  Execute
</button>
        <div className="menu">

          <span>Memory</span>
          <span>Tasks</span>
          <span>Logs</span>
          <span>Settings</span>

        </div>

      </div>

    </div>
  );
}

export default App;