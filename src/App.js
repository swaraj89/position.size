import React from "react";
import ReactDOM from "react-dom";
import { ContextProvider } from "./Context";
import PositionSizer from "./PositionSizer";
const App = () => {
  return <PositionSizer></PositionSizer>;
};

ReactDOM.render(
  <ContextProvider>
    <App />
  </ContextProvider>,
  document.getElementById("root")
);
