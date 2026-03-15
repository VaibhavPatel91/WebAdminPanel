import Joi from 'joi';

export const productSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  category: Joi.string().required(), // Category ID
});

