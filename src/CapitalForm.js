import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Slider,
  Stack,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";

const CapitalForm = ({ capital, onFreeze }) => {
  const [value, setValue] = useState(30);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const capitalInput = +event.target.capital.value;
    const riskOfTotalInput = +event.target.riskOfTotal.value;
    const perShareRiskInput = +event.target.perShare.value;

    onFreeze({
      capital: capitalInput,
      riskOfTotal: riskOfTotalInput,
      perShareRisk: perShareRiskInput,
    });
  };

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleFormSubmit}
    >
      <Stack spacing={2}>
        <TextField
          required
          id="outlined-required"
          name="capital"
          label="Capital"
          type="number"
          variant="filled"
          helperText="The amount with which you trade"
          defaultValue={capital}
        />
        <Grid container spacing={2} alignItems="center" direction="row">
          <Grid item xs={12}>
            % Investment Per Share
          </Grid>
          <Grid item xs={12}>
            <Slider
              value={typeof value === "number" ? value : 0}
              onChange={handleSliderChange}
              aria-labelledby="input-slider"
              valueLabelDisplay="auto"
              name="perShare"
            />
          </Grid>
          {/* <Grid item xs={12}>
            <Input
              value={value}
              size="medium"
              fullWidth
              onChange={handleInputChange}
              onBlur={handleBlur}
              inputProps={{
                step: 1,
                min: 0,
                max: 100,
                type: "number",
                "aria-labelledby": "input-slider",
              }}
            />
          </Grid> */}
        </Grid>
        <FormControl>
          <FormLabel id="riskOfTotal">Risk Of Total Equity</FormLabel>
          <RadioGroup row aria-labelledby="riskOfTotal" name="riskOfTotal">
            <FormControlLabel value="1.25" control={<Radio />} label="1.25%" />
            <FormControlLabel value="2.5" control={<Radio />} label="2.5%" />
            <FormControlLabel value="3.75" control={<Radio />} label="3.75%" />
            <FormControlLabel value="5" control={<Radio />} label="5.0%" />
          </RadioGroup>
        </FormControl>
      </Stack>
      <Button variant="outlined" type="submit">
        Freeze
      </Button>
    </Box>
  );
};

CapitalForm.propTypes = {
  capital: PropTypes.number.isRequired,
  onFreeze: PropTypes.func.isRequired,
};

export default CapitalForm;
