import { Box, Typography } from "@mui/material";
import React from "react";
import { ShopLayout } from "../components/layouts";

const Custom404 = () => {
  return (
    <ShopLayout title="Page not Found" pageDescription="No se encontro nada para mostrar">
      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        justifyContent="center"
        alignItems="center"
        height="calc(100vh - 200px)"
      >
        <Typography variant="h1" component="h1" fontSize="80px" fontWeight={200}>
          404
        </Typography>
        <Typography
          marginLeft={1}
          display={{ xs: "none", md: "block" }}
          variant="h1"
          component="h1"
          fontSize="80px"
          fontWeight={200}
        >
          |
        </Typography>
        <Typography marginLeft={2}>No se encontro algo por aqui</Typography>
      </Box>
    </ShopLayout>
  );
};

export default Custom404;
