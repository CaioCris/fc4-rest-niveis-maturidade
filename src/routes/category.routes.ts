import { Router } from 'express';
import { createCategoryService } from '../services/category.service';
import { Resource, ResourceCollection } from '../http/resource';

const router = Router();

router.get('/:categorySlug', async (req, res, next) => {
    const categoryService = await createCategoryService();
    const category = await categoryService.getCategoryBySlug(req.params.categorySlug);
    if (!category) {
        res.status(404).json({
            title: 'Not Found',
            status: 404,
            detail: `Category with slug ${req.params.categorySlug} not found`
        });
    }
    const resource = new Resource(category);
    next(resource);
});

router.get('/', async (req, res, next) => {
    const categoryService = await createCategoryService();
    const { page = 1, limit = 10, name } = req.query;
    const { categories, total } = await categoryService.listCategories({
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        filter: { name: name as string }
    });
    const collection = new ResourceCollection(categories, {
        paginationData: {
            total,
            page: parseInt(page as string),
            limit: parseInt(limit as string)
        }
    });
    next(collection);
});

export default router;