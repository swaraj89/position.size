import React from "react";
import { AppBar, Typography } from "@mui/material";
import { Box } from "@mui/system";

const Header = () => {
  return (
    <Box>
      <AppBar position="static">
        <Typography
          variant="h3"
          component="h1"
          p={2}
          sx={{
            color: `#d3d3d3`,
          }}
        >
          Position Sizer
        </Typography>
      </AppBar>
    </Box>
  );
};

export default Header;
