import { Request, Response } from 'express';
import CreateCustomerService from '../services/CreateCustomerService';
import DeleteCustomerService from '../services/DeleteCustomerService';
import ListCustomerService from '../services/ListCustomersService';
import ShowCustomerService from '../services/ShowCustomerService';
import UpdateCustomerService from '../services/UpdateCustomerService';
export default class CustomersController {

  public async index(request: Request, response: Response): Promise<Response> {
    const listCustomers = new ListCustomerService();
    const customers = await listCustomers.execute();

    return response.json(customers);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const showCustomer = new ShowCustomerService();

    const product = await showCustomer.execute({ id });
    return response.json(product);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email } = request.body;

    const createCustomer = new CreateCustomerService();
    const newProduct = await createCustomer.execute({ name, email });

    return response.json(newProduct);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { name, email } = request.body;

    const updateCustomer = new UpdateCustomerService();
    const updatedProduct = await updateCustomer.execute({ id, name, email });

    return response.json(updatedProduct);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const deleteCustomer = new DeleteCustomerService();
    const deletedCustomer = await deleteCustomer.execute({ id });

    return response.json(deletedCustomer);
  }
}