import React from "react";
import { Grid, Typography } from "@mui/material";

import { getValueOfCapital } from "./utilities/sizerUtil";
import { Context } from "./Context";

const DisplayCapital = () => {
  const { capital, maxPosition, riskOfEquity } = React.useContext(Context);
  const [capitalValue] = capital;
  const [maxPositionValue] = maxPosition;
  const [riskOfEquityValue] = riskOfEquity;

  return (
    <Grid container>
      <Grid item xs={4}>
        <Typography
          align="center"
          component={"p"}
          gutterBottom
          variant="overline"
        >
          Capital
        </Typography>
        <Typography align="center" component={"div"} variant="h4">
          &#8377; {capitalValue}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography
          align="center"
          component={"p"}
          gutterBottom
          variant="overline"
        >
          Per Trade Allocation
        </Typography>
        <Typography align="center" component={"div"} variant="h4">
          &#8377; {getValueOfCapital(capitalValue, maxPositionValue).toFixed()}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography
          align="center"
          component={"p"}
          gutterBottom
          variant="overline"
        >
          Risk Per Trade
        </Typography>
        <Typography align="center" component={"div"} variant="h4">
          &#8377; {getValueOfCapital(capitalValue, riskOfEquityValue).toFixed()}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default DisplayCapital;
