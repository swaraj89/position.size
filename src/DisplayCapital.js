import React from "react";
import PropTypes from "prop-types";

const DisplayCapital = ({ maxRisk, capital, percentagePerShare }) => {
  return (
    <p>
      Risk - {maxRisk} | Capital - {capital} | Max Per Share -{" "}
      {percentagePerShare / 100}
    </p>
  );
};

DisplayCapital.propTypes = {
  maxRisk: PropTypes.number.isRequired,
  capital: PropTypes.number.isRequired,
  percentagePerShare: PropTypes.number.isRequired,
};
export default DisplayCapital;
