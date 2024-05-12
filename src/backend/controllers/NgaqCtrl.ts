/* // controllers/userController.ts

import { Request, Response } from 'express';
import userService from '../services/userService';

const userController = {
  async registerUser(req: Request, res: Response) {
    try {
      const newUser = await userService.registerUser(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async loginUser(req: Request, res: Response) {
    try {
      const user = await userService.loginUser(req.body);
      res.status(200).json(user);
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  },

  async getUserById(req: Request, res: Response) {
    try {
      const user = await userService.getUserById(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
};

export default userController; */

class NgaqCtrl{
	protected constructor(){}
	static new(){
		const z = new this()
		return z.__init__()
	}

	protected __init__(){
		const z = this
		return z
	}

	get_allTablesWords(req: Request, res:Response){
		const z = this
	}

}