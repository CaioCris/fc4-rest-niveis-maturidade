import { Router } from 'express';
import { createCategoryService } from '../../services/category.service';
import { Resource, ResourceCollection } from '../../http/resource';

const router = Router();

router.post('/', async (req, res, next) => {
    const categoryService = await createCategoryService();
    const { name, slug } = req.body;
    const category = await categoryService.createCategory({ name, slug });
    const resource = new Resource(category);
    next(resource);
});

router.get('/:categoryId', async (req, res, next) => {
    const categoryService = await createCategoryService();
    const { categoryId } = req.params;
    const category = await categoryService.getCategoryById(+categoryId);
    const resource = new Resource(category);
    next(resource);
});

router.patch('/:categoryId', async (req, res, next) => {
    const categoryService = await createCategoryService();
    const { categoryId } = req.params;
    const { name, slug } = req.body;
    const category = await categoryService.updateCategory({ id: +categoryId, name, slug });
    const resource = new Resource(category);
    next(resource);
});

router.delete('/:categoryId', async (req, res) => {
    const categoryService = await createCategoryService();
    const { categoryId } = req.params;
    await categoryService.deleteCategory(+categoryId);
    res.sendStatus(204);
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