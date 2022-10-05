import { Request, Response } from "express";
import IResponse from "src/interfaces/IResponse";
import DeleteUserService from "../services/DeleteUserService";
import ShowProfileService from "../services/ShowProfileService";
import UpdateProfileService from "../services/UpdateProfileService";
export default class ProfileController{

  public async show(request: Request, response: Response): Promise<Response>{
    const user_id = request.user.id;
    
    const showProfile = new ShowProfileService();
    const user = await showProfile.execute({ user_id });

    let userRetorno: IResponse<any> = {...user};
    userRetorno.data.password = undefined;

    return response.json(user);
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

    return response.json(updateUser);
  }

  public async delete(request: Request, response: Response): Promise<Response> {

    const deleteUserService = new DeleteUserService();
    const { id } = request.params;
    const deletedUser = await deleteUserService.execute(id);

    return response.json(deletedUser);
  }
}