import { Box, Button, Chip, Grid, Typography } from "@mui/material";
import { NextPage, GetStaticPaths, GetStaticProps } from "next";
import React, { useContext, useState } from "react";
import { ShopLayout } from "../../components/layouts";
import { SizeSelector } from "../../components/products";

import { ProductSlideshow } from "../../components/products/ProductSlideshow";
import { ItemCounter } from "../../components/ui";
import { IProduct, ISize } from "../../interfaces";
import { dbProducts } from "../../database";
import { ICartProduct } from "../../interfaces/cart";
import { CartContext } from "../../context";
import { useRouter } from "next/router";

interface Props {
  product: IProduct;
}

const ProductPage: NextPage<Props> = ({ product }) => {
  const { addProductToCart } = useContext(CartContext);
  const { push } = useRouter();
  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1
  });

  const onSelect = (size: ISize) => {
    setTempCartProduct((currentProduct) => ({
      ...currentProduct,
      size
    }));
  };

  const handleUpdateCount = (value: number) => {
    setTempCartProduct((currentProduct) => ({
      ...currentProduct,
      quantity: currentProduct.quantity + value
    }));
  };

  const addProduct = () => {
    if (!tempCartProduct.size) return;

    addProductToCart(tempCartProduct);
    push("/cart");
  };

  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <ProductSlideshow images={product.images} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Box display="flex" flexDirection="column">
            {/* titles */}
            <Typography variant="h1" component="h1">
              {product.title}
            </Typography>
            <Typography variant="subtitle1" component="h2">
              {`$${product.price}`}
            </Typography>

            <Box sx={{ my: 2 }}>
              <Typography variant="subtitle2" component="div">
                Cantidad
                <h1>{product.inStock}</h1>
              </Typography>
              <ItemCounter
                currentValue={tempCartProduct.quantity}
                handleUpdateCount={handleUpdateCount}
                maxValue={product.inStock > 10 ? 10 : product.inStock}
              />
              <SizeSelector selectedSize={tempCartProduct.size} sizes={product.sizes} onSelect={onSelect} />
            </Box>

            {product.inStock > 0 ? (
              <Button color="secondary" className="circular-btn" onClick={addProduct}>
                {tempCartProduct.size ? "Agregar al carrito" : "Seleccione una talla"}
              </Button>
            ) : (
              <Chip label="No hay disponibles" color="error" variant="outlined" />
            )}

            {/* description */}

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2">Descripción</Typography>

              <Typography variant="body2">{product.description}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const slugs = await dbProducts.getAllProductSlugs();

  const paths = slugs.map(({ slug }) => ({ params: { slug } }));

  return {
    paths,
    fallback: "blocking"
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug = "" } = params as { slug: string };

  const product = await dbProducts.getProductBySlug(slug.toString());

  if (!product) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    };
  }

  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24
  };
};

export default ProductPage;
