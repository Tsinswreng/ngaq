/* // routes/userRoutes.ts

import express from 'express';
import userController from '../controllers/userController';

const router = express.Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/:id', userController.getUserById);

export default router; */
