import { Card, CardContent, Divider, Grid, Typography, Box, Chip, CircularProgress } from "@mui/material";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";
import { CreditScoreOutlined, CreditCardOffOutlined } from "@mui/icons-material";
import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import { dbOrders } from "../../database";
import { IOrder } from "../../interfaces";
import { PayPalButtons } from "@paypal/react-paypal-js";
import tesloApi from "../../api/tesloApi";
import { useRouter } from "next/router";
import { countries } from "../../utils";

const CartList = dynamic(() => import("../../components/cart").then((i) => i.CartList), { ssr: false });

export type OrderResponseBody = {
  id: string;
  status: "COMPLETED" | "SAVED" | "APPROVED" | "VOIDED" | "PAYER_ACTION_REQUIRED";
};

interface Props {
  order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
  const router = useRouter();
  const { _id, isPaid, numberOfItems, shippingAddress, orderItems, subTotal, tax, total } = order;
  const [isPaying, setIsPaying] = useState(false);
  const countryName = countries.find((country) => country.code === shippingAddress.country)!.name || "No encontrado";

  const onOrderCompleted = async (details: OrderResponseBody) => {
    if (details.status !== "COMPLETED") {
      return alert("No hay pago en paypal");
    }

    setIsPaying(true);

    try {
      const { data } = await tesloApi.post("/orders/pay", {
        transactionId: details.id,
        orderId: order._id,
      });

      router.reload();
    } catch (error) {
      setIsPaying(true);
      console.log(error);
      alert("error");
    }
  };

  return (
    <ShopLayout title={`Resumen de la orden ${_id}`} pageDescription="Resumen de la orden">
      <Typography variant="h1" component="h1">
        Orden: {_id}
      </Typography>

      {isPaid ? (
        <Chip
          sx={{ my: 2 }}
          label="Orden ya fue pagada"
          variant="outlined"
          color="success"
          icon={<CreditScoreOutlined />}
        />
      ) : (
        <Chip
          sx={{ my: 2 }}
          label="Pendiente de pago"
          variant="outlined"
          color="error"
          icon={<CreditCardOffOutlined />}
        />
      )}

      <Grid container className="fadeIn">
        <Grid item xs={12} sm={7}>
          <CartList products={orderItems} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">
                Resumen ({numberOfItems} {numberOfItems > 1 ? "productos" : "producto"})
              </Typography>
              <Divider sx={{ my: 1 }} />

              <Typography variant="subtitle1">Dirección de entrega</Typography>
              <Typography>
                {shippingAddress.firstName} {shippingAddress.lastName}
              </Typography>
              <Typography>
                {shippingAddress.address} {shippingAddress.address2 ? shippingAddress.address2 : ""}
              </Typography>
              <Typography>
                {shippingAddress.city} {shippingAddress.zip}
              </Typography>
              <Typography>{countryName}</Typography>
              <Typography>{shippingAddress.phone}</Typography>

              <Divider sx={{ my: 1 }} />

              <OrderSummary summaryValues={{ numberOfItems, subTotal, total, tax }} />

              <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                <Box justifyContent="center" className="fadeIn" sx={{ display: isPaying ? "flex" : "none" }}>
                  <CircularProgress />
                </Box>

                <Box sx={{ display: isPaying ? "none" : "flex", flex: 1, flexDirection: "column" }}>
                  {isPaid ? (
                    <Chip
                      sx={{ my: 2 }}
                      label="Orden ya fue pagada"
                      variant="outlined"
                      color="success"
                      icon={<CreditScoreOutlined />}
                    />
                  ) : (
                    <PayPalButtons
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: order.total.toString(),
                              },
                            },
                          ],
                        });
                      }}
                      onError={(err) => {
                        console.log(err);
                      }}
                      onApprove={(data, actions) => {
                        return actions.order!.capture().then((details) => {
                          onOrderCompleted(details);
                          const name = details.payer.name!.given_name;
                        });
                      }}
                    />
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const { id = "" } = query; // your fetch function here
  const session: any = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?p=/orders/${id}`,
        permanent: false,
      },
    };
  }

  const order = await dbOrders.getOrderById(id.toString());

  if (!order) {
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false,
      },
    };
  }

  if (order.user !== session.user._id) {
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      order,
    },
  };
};

export default OrderPage;
