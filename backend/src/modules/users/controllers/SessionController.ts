import { Request, Response } from "express";
import { instanceToInstance } from 'class-transformer';
import CreateSessionsService from "../services/CreateSessionsService";


export default class SessionController{

  public async createSessions(request: Request, response: Response): Promise<Response> {
    const createSessionsUserService = new CreateSessionsService();
    const { email, password } = request.body;

    const user = await createSessionsUserService.execute({ email, password });
    return response.json(instanceToInstance(user));
  }
}