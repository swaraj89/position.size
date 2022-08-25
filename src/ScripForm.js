import React from "react";
import PropTypes from "prop-types";
import { Grid, TextField, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import { Context } from "./Context";

function getHelperText(cmp, sl) {
  return (((cmp - sl) / cmp) * 100).toFixed(2) + `% of CMP`;
}

const ScripForm = ({ onInput }) => {
  const { cmp, sl } = React.useContext(Context);
  const theme = useTheme();
  const isBelowSM = useMediaQuery(theme.breakpoints.down("sm"));

  const [cmpValue] = cmp;
  const [slValue] = sl;

  const handleInputChange = ({ target }) => {
    const data = { [target.name]: +target.value };

    onInput(data);
  };

  return (
    <Grid container spacing={2} sx={{ padding: `10px` }}>
      <Grid item xs={12} md={6}>
        <TextField
          required
          id="outlined-required"
          name="cmp"
          label="Current Market Price(Per share)"
          type="number"
          variant="outlined"
          helperText="Current Market Price"
          fullWidth
          value={cmpValue}
          onChange={handleInputChange}
          onBlur={handleInputChange}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          required
          id="outlined-required"
          name="sl"
          label="Stop Loss"
          type="number"
          variant="outlined"
          value={slValue}
          helperText={getHelperText(cmpValue, slValue)}
          onChange={handleInputChange}
          onBlur={handleInputChange}
          error={cmpValue <= slValue}
          fullWidth={isBelowSM}
        />
      </Grid>
      {cmpValue <= slValue ? (
        <Grid item xs>
          <Typography variant="caption" color="error">
            CMP cannot be less than SL
          </Typography>
        </Grid>
      ) : null}
    </Grid>
  );
};

ScripForm.propTypes = {
  onInput: PropTypes.func.isRequired,
  cmp: PropTypes.number.isRequired,
  sl: PropTypes.number.isRequired,
};

export default ScripForm;
