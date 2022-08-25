import React from "react";
import ReactDOM from "react-dom";
import { ContextProvider } from "./Context";
import Footer from "./Footer";
import Header from "./Header";
import PositionSizer from "./PositionSizer";

const App = () => {
  return (
    <>
      <Header />
      <PositionSizer />
      <Footer />
    </>
  );
};

ReactDOM.render(
  <ContextProvider>
    <App />
  </ContextProvider>,
  document.getElementById("root")
);
