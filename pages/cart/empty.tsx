import { RemoveShoppingCartOutlined } from "@mui/icons-material";
import { Box, Typography, Link } from "@mui/material";
import { ShopLayout } from "../../components/layouts";
import NextLink from "next/link";

const EmptyPage = () => (
  <ShopLayout title="Carrito vacio" pageDescription="No hay articulos en el carrito de compras">
    <Box
      display="flex"
      flexDirection={{ xs: "column", md: "row" }}
      justifyContent="center"
      alignItems="center"
      height="calc(100vh - 200px)"
    >
      <RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography>Su carrito está vació</Typography>
        <NextLink href="/" passHref>
          <Link typography="h4" color="secondary">
            Regresar
          </Link>
        </NextLink>
      </Box>
    </Box>
  </ShopLayout>
);

export default EmptyPage;
