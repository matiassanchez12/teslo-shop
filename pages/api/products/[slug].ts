import type { NextApiRequest, NextApiResponse } from "next";
import { SHOP_CONSTANTS, db } from "../../../database";
import { IProduct } from "../../../interfaces";
import { Product } from "../../../models";

type Data = { message: string } | IProduct;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case "GET":
      return getProductBySlug(req, res);
    default:
      return res.status(400).json({
        message: "Bad request",
      });
  }
}

const getProductBySlug = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { slug } = req.query;

  await db.connect();

  const product = await Product.findOne({ slug }).lean();

  await db.disconnect;

  if (!product) return res.status(404).json({ message: "No se encontro el producto" });

  product.images = product.images.map((image) => {
    return image.includes("http") ? image : `/products/${image}`;
  });

  return res.status(200).json(product);
};
