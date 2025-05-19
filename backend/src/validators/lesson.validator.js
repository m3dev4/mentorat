import Joi from 'joi';

export const lessonSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required().min(10).max(500),
  order: Joi.number().integer().default(0),
});