import mongoose from 'mongoose';
import AppError from '../../middlewares/appError.middleware.js';
import asyncHandler from '../../middlewares/asyncHandler.middleware.js';
import Category from '../../models/category.model.js';



// Créer une nouvelle categorie
export const createCategory = asyncHandler(async (req, res, next) => {
  try {
    const newCategory = await Category.create(req.body);

    if (!newCategory) {
      return next(new AppError('Erreur lors de la creation du category', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        category: newCategory,
      },
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(error.message, 500));
  }
});

// Obtenir toutes les categories
export const getAllCategory = asyncHandler(async (req, res, next) => {
  try {
    // Filtre pour les cartegories de premiere niveau
    const filter = {};
    if (req.query.topLevel === 'true') {
      filter.parent = null;
    }

    if (req.query.active === 'true') {
      filter.isActive = true;
    }

    const categories = await Category.find(filter)
      .populate('subcategories')
      .sort({ order: 1, name: 1 });

    res.status(200).json({
      status: 'success',
      data: {
        categories,
      },
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(error.message, 500));
  }
});

// Obtenir une categorie par ID ou slug
export const getCategory = asyncHandler(async (req, res, next) => {
  const { idOrSlug } = req.params;

  //chercher par ID ou par slug
  const query = mongoose.Types.ObjectId.isValid(idOrSlug) ? { _id: idOrSlug } : { slug: idOrSlug };

  const category = await Category.findOne(query).populate('subcategories').populate('courseCount');

  if (!category) {
    return next(new AppError('Categorie non trouvee', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      category,
    },
  });
});

//Mettre a jour une categorie
export const updateCategory = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return next(new AppError('Categorie non trouvee', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        category,
      },
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(error.message, 500));
  }
});

//Supprimer une categorie
export const deleteCategory = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;

    //Verifier s'il y'a des sous-categories
    const hasSubcategories = await Category.countDocuments({ parent: id });

    if (hasSubcategories > 0) {
      return next(
        new AppError('Impossible de supprimer une categorie avec des sous-categories', 400),
      );
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return next(new AppError('Categorie non trouvee', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        category,
      },
    });
  } catch (error) {
    console.error(error);
    return next(new AppError(error.message, 500));
  }
});

