import { Router } from 'express';
import * as bookController from '../controllers/book.js';

const router = Router();

router.get('/', bookController.list);
router.get('/featured', bookController.featured);
router.get('/new', bookController.newArrivals);
router.get('/:id', bookController.detail);

export default router;