import React, { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import CapitalForm from "./CapitalForm";
import DisplayCapital from "./DisplayCapital";
import SizeDisplay from "./SizeDisplay";
import ScripForm from "./ScripForm";
import { Container } from "@mui/system";
import { deepPurple } from "@mui/material/colors";

import { Context } from "./Context";
import { getExtraQty, getValueOfCapital } from "./utilities/sizerUtil";

const PositionSizer = () => {
  const [qty, setQty] = useState(100);
  const {
    capital,
    maxPosition: maxPositionContext,
    riskOfEquity: riskOfEquityContext,
    cmp: cmpContext,
    sl: slContext,
  } = React.useContext(Context);

  const [capitalValue, setCapitalValue] = capital;
  const [maxPositionValue, setMaxPositionValue] = maxPositionContext;
  const [riskOfEquityValue, setRiskOfEquityValue] = riskOfEquityContext;

  const [cmp, setCmp] = cmpContext;
  const [sl, setSl] = slContext;

  const handleCapitalFormUpdate = (data) => {
    if (!data) return;
    else if (data.capital) setCapitalValue(data.capital);
    else if (data.maxPosition) setMaxPositionValue(data.maxPosition);
    else if (data.riskOfEquity) setRiskOfEquityValue(data.riskOfEquity);
  };

  const handleScripInput = (data) => {
    if (!data) return;
    else if (data.cmp) setCmp(data.cmp);
    else if (data.sl) setSl(data.sl);
  };

  useEffect(() => {
    // logic to calculae position size
    const maxLossPerShare = cmp - sl;
    const qty =
      getValueOfCapital(riskOfEquityValue, capitalValue) / maxLossPerShare;
    const maxCost = qty * cmp;
    const maxPositionCost = (maxPositionValue / 100) * capitalValue;

    if (maxPositionCost < maxCost) {
      const extra = getExtraQty(cmp, maxCost, maxLossPerShare);
      setQty(Math.floor(qty - extra));
    } else {
      setQty(Math.floor(qty));
    }
  }, [capitalValue, cmp, sl, maxPositionValue, riskOfEquityValue]);

  return (
    <>
      <Container maxWidth="lg">
        <Grid container spacing={0.5} sx={{ padding: "10px" }} mt={10}>
          <Grid item xs={12}>
            <Typography
              variant="h5"
              component="h5"
              gutterBottom
              color={deepPurple[100]}
            >
              POSITION.SIZE
            </Typography>
          </Grid>
          <Grid item xs p={3}>
            <Box className="form-holder" mb={2}>
              <Typography variant="overline" component="p" gutterBottom>
                Set Your Portfolio details
              </Typography>
              <CapitalForm onInputChange={handleCapitalFormUpdate} />
            </Box>
            <Box className="form-holder" mb={2}>
              <Typography variant="overline" component="p" gutterBottom>
                Set Scrip details
              </Typography>
              <ScripForm onInput={handleScripInput}></ScripForm>
            </Box>
          </Grid>
          <Grid item xs p={3}>
            <Box className="form-holder" mb={2}>
              <DisplayCapital></DisplayCapital>
            </Box>
            <Box className="form-holder">
              <SizeDisplay quantity={qty} cost={qty * cmp} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default PositionSizer;
