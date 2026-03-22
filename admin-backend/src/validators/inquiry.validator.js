import Joi from 'joi';

export const inquirySchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  city: Joi.string().required(),
  message: Joi.string().required(),
});

