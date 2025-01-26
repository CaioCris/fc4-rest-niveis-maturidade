import { Router } from 'express';
import { createCustomerService } from '../../services/customer.service';
import { Resource, ResourceCollection } from '../../http/resource';

const router = Router();

router.post('/', async (req, res, next) => {
    const customerService = await createCustomerService();
    const { name, email, password, phone, address } = req.body;
    const customer = await customerService.registerCustomer({ name, email, password, phone, address });
    const resource = new Resource(customer);
    next(resource);
});

router.get('/:customerId', async (req, res, next) => {
    const customerService = await createCustomerService();
    const { customerId } = req.params;
    const customer = await customerService.getCustomer(+customerId);
    if(!customer) {
        res.status(404).json({ 
          title: 'Not Found',
          status: 404,
          detail: `Customer with id ${customerId} not found`
         });
      }
    const resource = new Resource(customer);
    next(resource);
});

router.patch('/:customerId', async (req, res, next) => {
    const customerService = await createCustomerService();
    const { customerId } = req.params;
    const { phone, address, password } = req.body;
    const customer = await customerService.updateCustomer({ customerId: +customerId, phone, address, password });
    const resource = new Resource(customer);
    next(resource);
});

router.delete('/:customerId', async (req, res) => {
    const customerService = await createCustomerService();
    const { customerId } = req.params;
    await customerService.deleteCustomer(+customerId);
    res.send({ message: 'Customer deleted successfully' });
});

router.get('/', async (req, res, next) => {
    const customerService = await createCustomerService();
    const { page = 1, limit = 10 } = req.query;
    const { customers, total } = await customerService.listCustomers({
        page: parseInt(page as string),
        limit: parseInt(limit as string)
    });
    const collection = new ResourceCollection(customers, {
        paginationData: {
            total,
            page: parseInt(page as string),
            limit: parseInt(limit as string)
        }
    });
    next(collection);
});

export default router;