import { Router } from "express";
import { createProductService } from "../../services/product.service";

const router = Router();

router.post("/", async (req, res) => {
  const productService = await createProductService();
  const { name, slug, description, price, categoryIds } = req.body;
  const product = await productService.createProduct(
    name,
    slug,
    description,
    price,
    categoryIds
  );
  res.json(product);
});

router.get("/:productId", async (req, res) => {
  const productService = await createProductService();
  const { productId } = req.params;
  const product = await productService.getProductById(+productId);
  res.json(product);
});

router.patch("/:productId", async (req, res) => {
  const productService = await createProductService();
  const { productId } = req.params;
  const { name, slug, description, price, categoryIds } = req.body;
  const product = await productService.updateProduct({
    id: +productId,
    name,
    slug,
    description,
    price,
    categoryIds,
  });
  res.json(product);
});

router.delete("/:productId", async (req, res) => {
  const productService = await createProductService();
  const { productId } = req.params;
  await productService.deleteProduct(+productId);
  res.send({ message: "Product deleted successfully" });
});

router.get("/", async (req, res) => {
  const productService = await createProductService();
  const {
    page = 1,
    limit = 10,
    name,
    categories_slug: categoriesSlugStr,
  } = req.query;
  const categories_slug = categoriesSlugStr
    ? categoriesSlugStr.toString().split(",")
    : [];
  const { products, total } = await productService.listProducts({
    page: parseInt(page as string),
    limit: parseInt(limit as string),
    filter: {
      name: name as string,
      categories_slug,
    },
  });
  res.json({ products, total });
});

router.get(".csv", async (req, res) => {
  const productService = await createProductService();
  const {
    page = 1,
    limit = 10,
    name,
    categories_slug: categoriesSlugStr,
  } = req.query;
  const categories_slug = categoriesSlugStr
    ? categoriesSlugStr.toString().split(",")
    : [];
  const { products } = await productService.listProducts({
    page: parseInt(page as string),
    limit: parseInt(limit as string),
    filter: {
      name: name as string,
      categories_slug,
    },
  });
  const csv = products
    .map((product) => {
      return `${product.name},${product.slug},${product.description},${product.price}`;
    })
    .join("\n");
  res.send(csv);
});

export default router;
