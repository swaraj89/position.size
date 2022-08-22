import React from "react";
import PropTypes from "prop-types";
import { Grid, Typography } from "@mui/material";

const SizeDisplay = ({ quantity, cost }) => {
  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography
          align="center"
          component={"p"}
          gutterBottom
          variant="overline"
        >
          Size
        </Typography>
        <Typography align="center" component={"div"} variant="h4">
          {quantity}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography
          align="center"
          component={"p"}
          gutterBottom
          variant="overline"
        >
          Cost
        </Typography>
        <Typography align="center" component={"div"} variant="h4">
          &#8377; {cost}
        </Typography>
      </Grid>
    </Grid>
  );
};

SizeDisplay.propTypes = {
  quantity: PropTypes.number.isRequired,
  cost: PropTypes.number.isRequired,
};

export default SizeDisplay;
