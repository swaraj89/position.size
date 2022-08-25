import React from "react";
import { Grid, Typography } from "@mui/material";

const Footer = () => {
  return (
    <footer>
      <Grid
        container
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        p={2}
      >
        <Grid item xs={6} sm={3}>
          <Typography variant="caption">
            Made with{" "}
            <Typography component={"span"} color={"error"}>
              &#10084;
            </Typography>{" "}
            by{" "}
            <Typography component={"span"} color={"error"}>
              <a
                href="https://github.com/swaraj89"
                target={"_blank"}
                rel="noreferrer"
              >
                swaraj89
              </a>
            </Typography>
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3} justifyContent={"flex-end"}>
          <Typography variant="caption">
            &copy;{new Date().getFullYear()}{" "}
            <a
              href="http://swarajpanigrahi.in"
              target={"_blank"}
              rel="noreferrer"
            >
              swarajpanigrahi.in
            </a>
          </Typography>
        </Grid>
      </Grid>
    </footer>
  );
};

export default Footer;
