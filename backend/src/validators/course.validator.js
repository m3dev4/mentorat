import Joi from 'joi';

export const courseSchema = Joi.object({
  title: Joi.string().required().min(5).max(100),
  subtitle: Joi.string().allow('', null),
  description: Joi.string().required().min(20).max(2000),
  objectives: Joi.array().items(Joi.string()),
  prerequisites: Joi.string().allow('', null),
  level: Joi.string().valid('débutant', 'intermédiaire', 'avancé', 'expert').required(),
  category: Joi.string().required(), // ID de la catégorie
  price: Joi.number().required().min(0),
  currency: Joi.string().default('EUR'),
  coverImage: Joi.string().allow('', null),
  promoVideo: Joi.string().allow('', null),
});
