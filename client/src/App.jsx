import { useState } from "react";
import "./App.css";
import Chat from "./components/chat/chat";
import Join from "./components/join/join";

const App = () => {
  const [handShake, setHandShake] = useState(null);
  const [chatVisibilty, setChatVisibility] = useState(false);
  return (
    <div className="App">
      {chatVisibilty ? (
        <Chat socket={handShake} />
      ) : (
        <Join state={setChatVisibility} handShake={setHandShake} />
      )}
    </div>
  );
};

export default App;
