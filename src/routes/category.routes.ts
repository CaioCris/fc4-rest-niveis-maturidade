import { Router } from 'express';
import { createCategoryService } from '../services/category.service';
import { Resource } from '../http/resource';

const router = Router();

router.get('/:categorySlug', async (req, res, next) => {
    const categoryService = await createCategoryService();
    const category = await categoryService.getCategoryBySlug(req.params.categorySlug);
      const resource = new Resource(category);
      next(resource);
});

router.get('/', async (req, res) => {
    const categoryService = await createCategoryService();
    const { page = 1, limit = 10, name } = req.query;
    const { categories, total } = await categoryService.listCategories({
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        filter: { name: name as string }
    });
    res.json({ categories, total });
});

export default router;