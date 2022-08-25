import React from "react";
import { Typography } from "@mui/material";
import { deepPurple } from "@mui/material/colors";

const Header = () => {
  return (
    <Typography
      variant="h5"
      component="div"
      gutterBottom
      color={deepPurple[400]}
      className={"app-name-holder"}
    >
      POSITION.SIZE
    </Typography>
  );
};

export default Header;
