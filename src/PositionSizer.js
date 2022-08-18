import React from "react";
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import CapitalForm from "./CapitalForm";
import DisplayCapital from "./DisplayCapital";
import Header from "./Header";
import ScripForm from "./ScripForm";

const PositionSizer = () => {
  const [capital, setCapital] = useState(100000);
  const [percentagePerShare, setPercentagePerShare] = useState(50);
  const [maxRisk, setMaxRisk] = useState(1.25);

  const handleCapitalFormFreeze = ({ capital, riskOfTotal, perShareRisk }) => {
    setCapital(capital);
    setMaxRisk((perShareRisk / 100) * capital);
    setPercentagePerShare(riskOfTotal);
  };

  return (
    <>
      <Header></Header>
      <Grid container spacing={0.5}>
        <Box
          xs={4}
          sx={{
            borderRight: `1px solid #232222`,
          }}
          p={3}
        >
          <CapitalForm
            capital={capital}
            percentagePerShare={percentagePerShare}
            maxRisk={maxRisk}
            onFreeze={handleCapitalFormFreeze}
          />
        </Box>
        <Box xs={8} p={3}>
          <DisplayCapital
            capital={capital}
            percentagePerShare={percentagePerShare}
            maxRisk={maxRisk}
          ></DisplayCapital>
          <ScripForm
            capital={capital}
            percentagePerShare={percentagePerShare}
            maxRisk={maxRisk}
          />
        </Box>
      </Grid>
    </>
  );
};

export default PositionSizer;
