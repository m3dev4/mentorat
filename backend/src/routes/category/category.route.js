import express from 'express';
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getCategory,
  updateCategory,
} from '../../controllers/category/category.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * Route public
 * @access Public
 * @route GET /api/v1/categories
 * @desc Obtenir toutes les categories
 *
 */
router.get('/', getAllCategory);
router.get('/:idOrSlug', getCategory);

router.use(protect);

/**
 * Route proteger
 * @access Private
 * @route POST /api/v1/categories
 * @desc Creer une categorie
 *
 */
router.post('/', createCategory);

/**
 * Route proteger
 * @access Private
 * @route PUT /api/v1/categories/:id
 * @desc Mettre a jour une categorie
 *
 */
router.put('/:id', updateCategory);

/**
 * Route proteger
 * @access Private
 * @route DELETE /api/v1/categories/:id
 * @desc Supprimer une categorie
 *
 */
router.delete('/:id', deleteCategory);


export default router;