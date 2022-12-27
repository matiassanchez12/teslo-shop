import { GetServerSideProps } from "next";
import type { NextPage } from "next";
import { Box, Typography } from "@mui/material";
import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products/ProductList";
import { dbProducts } from "../../database";
import { IProduct } from "../../interfaces";

interface Props {
  products: IProduct[];
  foundProducts: boolean;
  query: string;
}

const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {
  return (
    <ShopLayout title="Teslo-shop - Search" pageDescription="Los mejores productos de teslo">
      <Typography variant="h1" component="h1">
        Buscar Producto
      </Typography>

      {foundProducts ? (
        <Typography variant="h2" textTransform="capitalize" sx={{ mb: 1 }}>
          Término: {query}
        </Typography>
      ) : (
        <Box display="flex" gap={2}>
          <Typography variant="h2" sx={{ mb: 1 }}>
            No encontramos ningún producto para la busqueda:
          </Typography>
          <Typography variant="h2" textTransform="capitalize" sx={{ mb: 1 }} color="secondary">
            {query}
          </Typography>
        </Box>
      )}
      <ProductList products={products} />
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { query = "" } = params as { query: string };

  if (query.length === 0) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }

  let products = await dbProducts.getProductsByTerm(query);
  const foundProducts = products.length > 0;

  if (!foundProducts) {
    products = await dbProducts.getAllProducts();
  }
  //Todo retornar otros productos

  return {
    props: {
      products,
      foundProducts,
      query,
    },
  };
};

export default SearchPage;
