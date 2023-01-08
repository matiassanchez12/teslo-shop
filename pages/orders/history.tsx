import { Chip, Grid, Link, Typography } from "@mui/material";
import React from "react";
import NextLink from "next/link";
import { ShopLayout } from "../../components/layouts";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import { dbOrders } from "../../database";
import { IOrder } from "../../interfaces";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "fullname", headerName: "Nombre Completo", width: 300 },
  {
    field: "paid",
    headerName: "Pagada",
    description: "Muestra información si está pagada la orden o no",
    width: 200,
    renderCell: (params: GridRenderCellParams) =>
      params.row.paid ? (
        <Chip color="success" label="Pagada" variant="outlined" />
      ) : (
        <Chip color="error" label="No pagada" variant="outlined" />
      ),
  },
  {
    field: "order",
    headerName: "Ver Orden",
    description: "Redirige al orden seleccionado",
    width: 200,
    sortable: false,
    renderCell: (params: GridRenderCellParams) => (
      <NextLink href={`/orders/${params.row.order}`} passHref>
        <Link underline="always">Ver Orden</Link>
      </NextLink>
    ),
  },
];

interface Props {
  orders: IOrder[];
}

const HistoryPage: NextPage<Props> = ({ orders }) => {
  const rows = orders.map((order, index) => ({
    id: index + 1,
    paid: order.isPaid,
    fullname: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
    order: order._id,
  }));

  return (
    <ShopLayout title="Historial de ordenes" pageDescription="Historial de ordenes del cliente">
      <Typography variant="h1" component="h1">
        Historial de ordenes
      </Typography>

      <Grid container className="fadeIn">
        <Grid item xs={12} sm={12} sx={{ height: 650, width: "100%" }}>
          <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10]} />
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session: any = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login?p=/orders/history",
        permanent: false,
      },
    };
  }

  const orders = await dbOrders.getOrdersByUser(session.user._id);

  return {
    props: {
      orders,
    },
  };
};

export default HistoryPage;
