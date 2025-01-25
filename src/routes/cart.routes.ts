import { Router } from "express";
import { createCartService } from "../services/cart.service";
import { Resource } from "../http/resource";

const router = Router();

router.post("/", async (req, res, next) => {
  const cartService = await createCartService();
  //@ts-expect-error
  const customerId = req.userId;
  const cart = await cartService.createCart(customerId);
  const resource = new Resource(cart);
  next(resource);
});

router.post("/:cartUuid/items", async (req, res) => {
  const cartService = await createCartService();
  // @ts-expect-error
  const customerId = req.userId;
  const { productId, quantity } = req.body;
  const cart = await cartService.addItemToCart({
    uuid: req.params.cartUuid,
    customerId: customerId,
    productId: parseInt(productId),
    quantity: parseInt(quantity),
  });
  res.json({
    id: cart.id,
    items: cart.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      product: {
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
      },
    })),
    createdAt: cart.createdAt,
    customer: cart.customer
  });
});

router.get("/:cartUuid", async (req, res, next) => {
  const cartService = await createCartService();
  const cartUuid = req.params.cartUuid;
  const cart = await cartService.getCart(cartUuid);
  const resource = new Resource(cart);
  next(resource);
});

router.delete("/:cartUuid/items/:cartItemId", async (req, res) => {
  const cartService = await createCartService();
  const { cartUuid, cartItemId } = req.params;
  await cartService.removeItemFromCart({
    cartUuid,
    cartItemId: +cartItemId,
  });
  res.send({ message: "Item removed from cart" });
});

router.post("/:cartUuid/clear", async (req, res, next) => {
  const cartService = await createCartService();
  const cartUuid = req.params.cartUuid;
  const cart = await cartService.clearCart(cartUuid);
  const resource = new Resource(cart);
  next(resource);
});

export default router;
