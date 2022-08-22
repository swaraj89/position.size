import React from "react";
import PropTypes from "prop-types";
import { Grid, Slider, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import InfoRounded from "@mui/icons-material/InfoRounded";

import { Context } from "./Context";

const CapitalForm = ({ onInputChange }) => {
  const handleSliderChange = (event, newValue) => {
    onInputChange({ [event.target.name]: newValue });
  };

  const { capital, maxPosition, riskOfEquity } = React.useContext(Context);
  const [capitalValue] = capital;
  const [maxPositionValue] = maxPosition;
  const [riskOfEquityValue] = riskOfEquity;

  return (
    <Box noValidate autoComplete="off">
      <Grid container spacing={2}>
        <Grid item xs={11}>
          <Typography gutterBottom sx={{ display: "flex" }}>
            Portfolio Size
            <Tooltip arrow title="some text will go here" placement="top">
              <InfoRounded color="disabled"></InfoRounded>
            </Tooltip>
          </Typography>
          <Slider
            value={capitalValue}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            valueLabelDisplay="auto"
            name="capital"
            key="capital"
            step={1000}
            min={0}
            max={100000}
            color="success"
            size="medium"
          />
        </Grid>
        <Grid item xs={11}>
          <Typography gutterBottom sx={{ display: "flex" }}>
            Position (in % of Portfolio size){" "}
            <Tooltip arrow title="some text will go here" placement="top">
              <InfoRounded color="disabled"></InfoRounded>
            </Tooltip>
          </Typography>
          <Slider
            // value={typeof value === "number" ? value : 0}
            value={maxPositionValue}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            valueLabelDisplay="auto"
            name="maxPosition"
            key="maxPosition"
            step={2.5}
            min={0}
            max={100}
            color="success"
            size="medium"
          />
        </Grid>
        <Grid item xs={11}>
          <Typography gutterBottom sx={{ display: "flex" }}>
            Risk Of Equity
            <Tooltip arrow title="some text will go here" placement="top">
              <InfoRounded color="disabled"></InfoRounded>
            </Tooltip>
          </Typography>
          <Slider
            value={riskOfEquityValue}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            valueLabelDisplay="auto"
            name="riskOfEquity"
            key="riskOfEquity"
            color="success"
            size="medium"
            step={1.25}
            min={1.25}
            max={5.0}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

CapitalForm.propTypes = {
  onInputChange: PropTypes.func.isRequired,
};

export default CapitalForm;
