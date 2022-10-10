import AppError from "@shared/errors/AppError";
import { instanceToInstance } from 'class-transformer';
import { Request, Response } from "express";
import DeleteUserService from "../services/DeleteUserService";
import ShowProfileService from "../services/ShowProfileService";
import UpdateProfileService from "../services/UpdateProfileService";

export default class ProfileController{

  public async show(request: Request, response: Response): Promise<Response>{
    try {
      const user_id = request.user.id;
    
      const showProfile = new ShowProfileService();
      const user = await showProfile.execute({ user_id });

      return response.json(instanceToInstance(user));
    } catch (error: any) {
      throw new AppError(error.message, 500);
    }
  }

  public async update(request: Request, response: Response): Promise<Response> {

    const updateProfileService = new UpdateProfileService();
    const user_id = request.user.id;
    const { name, email, password, old_password } = request.body;
    const updateUser = await updateProfileService.execute({ 
      user_id, 
      name, 
      email, 
      password,
      old_password
    });

    return response.json(instanceToInstance(updateUser));
  }

  public async delete(request: Request, response: Response): Promise<Response> {

    const deleteUserService = new DeleteUserService();
    const { id } = request.params;
    const deletedUser = await deleteUserService.execute(id);

    return response.json(deletedUser);
  }
}