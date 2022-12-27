import { Card, CardContent, Divider, Grid, Typography, Button, Box, Link, Chip } from "@mui/material";
import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import { OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";
import dynamic from "next/dynamic";
import { useContext, useMemo } from "react";
import { CartContext } from "../../context";
import { countries } from "../../utils/countries";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const CartList = dynamic(() => import("../../components/cart").then((i) => i.CartList), { ssr: false });

const SummaryPage = () => {
  const { shippingAddress, numberOfItems, createOrder } = useContext(CartContext);
  const router = useRouter();
  const [isPosting, setIsPosting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!Cookies.get("firstName")) {
      router.push("/checkout/address");
    }
  }, [router]);

  const onCreateOrder = async () => {
    setIsPosting(true);

    const { hasError, message } = await createOrder();

    if (hasError) {
      setIsPosting(false);
      setErrorMessage(message);
      return;
    }

    router.replace(`/orders/${message}`);
  };

  if (!shippingAddress) return <></>;

  const { address, city, country, firstName, lastName, phone, zip, address2 } = shippingAddress;
  const countryName = countries.find((item) => item.code.toLowerCase() === country.toLowerCase())?.name;

  return (
    <ShopLayout title="Resumen de orden" pageDescription="Resumen de la orden">
      <Typography variant="h1" component="h1">
        Resumen de la orden
      </Typography>
      <Grid container>
        <Grid item xs={12} sm={7}>
          <CartList />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">
                Resumen ({numberOfItems} {numberOfItems > 1 ? "productos" : "producto"})
              </Typography>
              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="end">
                <NextLink href="/checkout/address" passHref>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>

              <Typography variant="subtitle1">Dirección de entrega</Typography>
              <Typography>
                {firstName} {lastName}
              </Typography>
              <Typography>
                {address}
                {address2 ? `, ${address2}` : ""}
              </Typography>
              <Typography>
                {city}, {zip}
              </Typography>
              <Typography>{countryName}</Typography>
              <Typography>{phone}</Typography>

              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="end">
                <NextLink href="/cart" passHref>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>

              <OrderSummary />

              <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                <Button
                  color="secondary"
                  disabled={isPosting}
                  className="circular-btn"
                  fullWidth
                  onClick={onCreateOrder}
                >
                  confirmar Orden
                </Button>

                <Chip color="error" label={errorMessage} sx={{ display: errorMessage ? "flex" : "none", mt: 2 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default SummaryPage;
