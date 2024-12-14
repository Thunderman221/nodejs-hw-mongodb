import express from 'express';
import {
  loginController,
  logoutController,
  refreshController,
  registerUserController,
  resetPasswordController,
  sendResetEmailController,
} from '../controllers/auth.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  loginSchema,
  registerSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validation/auth.js';

const router = express.Router();

router.post(
  '/register',
  validateBody(registerSchema),
  ctrlWrapper(registerUserController),
);

router.post('/login', validateBody(loginSchema), ctrlWrapper(loginController));

router.post('/refresh', ctrlWrapper(refreshController));

router.post('/logout', ctrlWrapper(logoutController));
export default router;

router.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(sendResetEmailController),
);

router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);
