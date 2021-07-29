import express from 'express';

import authRouter from './auth';
import meRouter from './me';
import paymentRouter from './payment';
import categoryRouter from './category';
import historyRouter from './history';
import githubLoginRouter from './github';

const router = express.Router();

router.use('/auth', authRouter);
// router.use('/githublogin', githubLoginRouter);
router.use('/me', meRouter);
router.use('/payments', paymentRouter);
router.use('/categories', categoryRouter);
router.use('/histories', historyRouter);

export default router;
