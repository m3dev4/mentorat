import Joi from 'joi';

export const moduleSchema = Joi.object({
  title: Joi.string().required().min(3).max(100),
  description: Joi.string().required().min(10).max(500),
  order: Joi.number().integer().min(0).default(0),
  hasAssessment: Joi.boolean().default(false),
  assessmentType: Joi.string().valid('QUIZ', 'PROJECT', 'EXERCISE').allow(null),
  passingScore: Joi.number().min(0).max(100).allow(null),
  unlockDate: Joi.date().allow(null),
});
