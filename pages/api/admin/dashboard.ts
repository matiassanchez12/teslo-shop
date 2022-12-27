import type { NextApiRequest, NextApiResponse } from "next";
import { dbOrders, dbProducts, dbUsers } from "../../../database";
import { Order, Product, User } from "../../../models";

type Data = {
  numberOfOrders: number;
  paidOrders: number;
  numberOfClients: number;
  numberOfProducts: number;
  productsWithNoInventory: number;
  lowInventory: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const values = await getStatisticValues();

  res.status(200).json(values);
}

const getStatisticValues = async () => {
  const [numberOfOrders, paidOrders, numberOfClients, numberOfProducts, productsWithNoInventory, lowInventory] =
    await Promise.all([
      Order.count(),
      Order.find({ isPaid: true }).count(),
      User.find({ role: "client" }).count(),
      Product.count(),
      Product.find({ inStock: 0 }).count(),
      Product.find({ inStock: { $lte: 10 } }).count(),
    ]);
  const notPaidOrders = numberOfOrders - paidOrders;

  return {
    numberOfOrders,
    paidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory,
    notPaidOrders,
  };
};
