import { Card, CardContent, Divider, Grid, Typography, Button, Box, Link } from "@mui/material";
import React, { useContext, useEffect } from "react";
import NextLink from "next/link";
import dynamic from "next/dynamic";
import { OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";
import { CartContext } from "../../context";
import { useRouter } from "next/router";

const CartList = dynamic(() => import("../../components/cart").then((i) => i.CartList), { ssr: false });

const CartPage = () => {
  const { isLoaded, cart } = useContext(CartContext);
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && cart.length === 0) {
      router.replace("/cart/empty");
    }
  }, [isLoaded, cart, router]);

  if (!isLoaded || cart.length === 0) return <></>;

  return (
    <ShopLayout title="Carrito - 3" pageDescription="Carrito de compras de la tienda">
      <Typography variant="h1" component="h1">
        Carrito
      </Typography>
      <Grid container>
        <Grid item xs={12} sm={7}>
          <CartList editable />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">Orden</Typography>
              <Divider sx={{ my: 1 }} />

              <OrderSummary />

              <Box sx={{ mt: 3 }}>
                <NextLink href="/checkout/address" passHref>
                  <Link>
                    <Button color="secondary" className="circular-btn" fullWidth>
                      Checkout
                    </Button>
                  </Link>
                </NextLink>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default CartPage;
