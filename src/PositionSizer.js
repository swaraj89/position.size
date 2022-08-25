import React, { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import CapitalForm from "./CapitalForm";
import DisplayCapital from "./DisplayCapital";
import SizeDisplay from "./SizeDisplay";
import ScripForm from "./ScripForm";
import { Container } from "@mui/system";

import { Context } from "./Context";
import { getExtraQty, getValueOfCapital } from "./util/sizerUtil";

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
    const maxLossInTrade = getValueOfCapital(riskOfEquityValue, capitalValue);
    let qty = Math.floor(maxLossInTrade / maxLossPerShare);
    let cost = qty * cmp;
    const canAfford = getValueOfCapital(capitalValue, maxPositionValue);

    while (cost > canAfford) {
      const extra = getExtraQty(cost, canAfford, maxLossPerShare);
      qty = qty - extra;
      cost = qty * cmp;
    }
    setQty(qty);
  }, [capitalValue, cmp, sl, maxPositionValue, riskOfEquityValue]);

  return (
    <>
      <Container maxWidth="lg" className="position-size-holder">
        <Grid
          container
          spacing={0.5}
          sx={{ padding: "10px" }}
          className="main-grid"
        >
          <Grid item p={{ xs: 0, sm: 3 }} xs={12} md={6}>
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
          <Grid item p={{ xs: 0, sm: 3 }} xs={12} md={6}>
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
