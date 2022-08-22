import React, { useState } from "react";
import PropTypes from "prop-types";

const Context = React.createContext();

const ContextProvider = ({ children }) => {
  const [capital, setCapital] = useState(10000);
  const [maxPosition, setMaxPosition] = useState(50);
  const [riskOfEquity, setRiskOfEquity] = useState(2.5);

  const [cmp, setCmp] = useState(1000);
  const [sl, setSl] = useState(990);

  const ValueObj = {
    capital: [capital, setCapital],
    maxPosition: [maxPosition, setMaxPosition],
    riskOfEquity: [riskOfEquity, setRiskOfEquity],
    cmp: [cmp, setCmp],
    sl: [sl, setSl],
  };

  return <Context.Provider value={ValueObj}>{children}</Context.Provider>;
};

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { Context, ContextProvider };
