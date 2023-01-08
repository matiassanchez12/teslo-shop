import { CreditScoreOutlined, CreditCardOffOutlined, AirplaneTicketOutlined } from "@mui/icons-material";
import { Typography, Chip, Grid, Card, CardContent, Divider, Box, CircularProgress } from "@mui/material";
import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { OrderSummary } from "../../../components/cart";
import { AdminLayout, ShopLayout } from "../../../components/layouts";
import { dbOrders } from "../../../database";
import { IOrder } from "../../../interfaces";
import { countries } from "../../../utils";

const CartList = dynamic(() => import("../../../components/cart").then((i) => i.CartList), { ssr: false });

export type OrderResponseBody = {
  id: string;
  status: "COMPLETED" | "SAVED" | "APPROVED" | "VOIDED" | "PAYER_ACTION_REQUIRED";
};

interface Props {
  order: IOrder;
}
const OrderPage: NextPage<Props> = ({ order }) => {
  const { _id, isPaid, numberOfItems, shippingAddress, orderItems, subTotal, tax, total } = order;
  const countryName = countries.find((country) => country.code === shippingAddress.country)!.name || "No encontrado";

  return (
    <AdminLayout title={`Resumen de la orden ${_id}`} subTitle={`Orden ID: ${_id}`} icon={<AirplaneTicketOutlined />}>
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
                <Box sx={{ display: "flex", flex: 1, flexDirection: "column" }}>
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
                      label="Orden pendiente de pago"
                      variant="outlined"
                      color="error"
                      icon={<CreditCardOffOutlined />}
                    />
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const { id = "" } = query; // your fetch function here
  const order = await dbOrders.getOrderById(id.toString());

  if (!order) {
    return {
      redirect: {
        destination: `/admin/orders`,
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
