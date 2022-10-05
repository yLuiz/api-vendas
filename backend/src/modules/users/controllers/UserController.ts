import { Request, Response } from "express";
import CreateUserService from "../services/CreateUserService";
import ListUserService from "../services/ListUserService";
import ShowUserService from "../services/ShowUserService";
import DeleteUserService from "../services/DeleteUserService";
import UpdateProfileService from "../services/UpdateProfileService";

export default class UserController{
  public async index(request: Request, response: Response):Promise<Response> {
    const listUserService = new ListUserService();
    const users = await listUserService.execute();

    return response.json(users);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const showUserService = new ShowUserService();
    const { id } = request.params;
    const user = await showUserService.execute(id);

    return response.json(user)
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const createUserService = new CreateUserService();
    const { name, email, password } = request.body;
    const newUser = await createUserService.execute({name, email, password});

    return response.json(newUser);
  }

  public async delete(request: Request, response: Response): Promise<Response> {

    const deleteUserService = new DeleteUserService();
    const { id } = request.params;
    const deletedUser = await deleteUserService.execute(id);

    return response.json(deletedUser);
  }
}