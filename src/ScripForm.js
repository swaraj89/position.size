import React from "react";
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { Box } from "@mui/system";
import {} from "./utilities/sizerUtil";

const ScripForm = () => {
  const qty = 0;

  return (
    <Box>
      <Card
        variant="outlined"
        sx={{ alignContent: `center`, padding: `5px`, maxWidth: `200px` }}
      >
        <CardContent>
          <Typography variant="h3" component="h3">
            {qty}
          </Typography>
        </CardContent>
        <CardActionArea>
          <Typography variant="h6" component="span">
            Quantity
          </Typography>
        </CardActionArea>
      </Card>
    </Box>
  );
};

export default ScripForm;
