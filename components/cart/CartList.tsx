import { Grid, Link, Typography, CardActionArea, CardMedia, Box, Button } from "@mui/material";
import { FC, useContext } from "react";
import NextLink from "next/link";
import { ItemCounter } from "../ui";
import { ICartProduct, IOrderItem } from "../../interfaces";
import { CartContext } from "../../context";

interface Props {
  editable?: boolean;
  products?: IOrderItem[];
}

export const CartList: FC<Props> = ({ editable = false, products }) => {
  const { cart, updateProductQuantity, removeCartProduct } = useContext(CartContext);
  const productsList = products ? products : cart;
  const onNewCartQuantityValue = (product: ICartProduct, newQuantityValue: number) => {
    product.quantity += newQuantityValue;
    updateProductQuantity(product);
  };

  const onRemoveProduct = (product: ICartProduct) => {
    removeCartProduct(product);
  };

  return (
    <>
      {productsList.map((product) => (
        <Grid container spacing={2} key={product.slug + product.size} sx={{ mb: 1 }}>
          <Grid item xs={3}>
            <NextLink href={`/product/${product.slug}`} passHref>
              <Link>
                <CardActionArea>
                  <CardMedia image={product.image} component="img" sx={{ borderRadius: "5px" }} />
                </CardActionArea>
              </Link>
            </NextLink>
          </Grid>

          <Grid item xs={7}>
            <Box display="flex" flexDirection="column">
              <Typography variant="body1">{product.title}</Typography>
              <Typography variant="body1">
                Talla: <strong>{product.size}</strong>
                {editable ? (
                  <ItemCounter
                    maxValue={10}
                    currentValue={product.quantity}
                    handleUpdateCount={(value) => onNewCartQuantityValue(product as ICartProduct, value)}
                  />
                ) : (
                  <Typography variant="h5">
                    {product.quantity} {product.quantity > 1 ? "productos" : "producto"}
                  </Typography>
                )}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={2} display="flex" alignItems="center" flexDirection="column">
            <Typography variant="subtitle1">{`$${product.price}`}</Typography>

            {/* Editable */}
            {editable && (
              <Button variant="text" color="secondary" onClick={() => onRemoveProduct(product as ICartProduct)}>
                Remover
              </Button>
            )}
          </Grid>
        </Grid>
      ))}
    </>
  );
};
