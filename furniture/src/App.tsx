import { useState } from "react"; // hooks

import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  function countHandler() {
    setCount((prevCount) => prevCount + 1);
    setCount((prevCount) => prevCount + 1);
  }

  return (
    <>
      <h1>Counter App - {count}</h1>
      <button onClick={countHandler}>Increase +</button>
    </>
  );
}

export default App;
