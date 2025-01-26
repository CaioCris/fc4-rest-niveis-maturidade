import { Router } from "express";
import { createProductService } from "../../services/product.service";
import { Resource, ResourceCollection } from "../../http/resource";
import { nextTick } from "process";
import { stat } from "fs";

const router = Router();

router.post("/", async (req, res, next) => {
  const productService = await createProductService();
  const { name, slug, description, price, categoryIds } = req.body;
  const product = await productService.createProduct(
    name,
    slug,
    description,
    price,
    categoryIds
  );
  res.set("Location", `/admin/products/${product.id}`).status(201);
  const resource = new Resource(product);
  next(resource);
});

router.get("/:productId", async (req, res, next) => {
  const productService = await createProductService();
  const { productId } = req.params;
  const product = await productService.getProductById(+productId);
  if(!product) {
    res.status(404).json({ 
      title: 'Not Found',
      status: 404,
      detail: `Product with id ${productId} not found`
     });
  }
  const resource = new Resource(product);
  next(resource);
});

router.patch("/:productId", async (req, res, next) => {
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
  const resource = new Resource(product);
  next(resource);
});

router.delete("/:productId", async (req, res) => {
  const productService = await createProductService();
  const { productId } = req.params;
  await productService.deleteProduct(+productId);
  res.status(204).end();
});

router.get("/", async (req, res, next) => {
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
  const collection = new ResourceCollection(products, {
    paginationData: {
      total,
      page: parseInt(page as string),
      limit: parseInt(limit as string)
    }
  });
  next(collection);
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
