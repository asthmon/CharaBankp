const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html')


const extension = (Joi) => ({
    type: 'string',
    base: Joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {}
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }

});

const Joi = BaseJoi.extend(extension);

module.exports.waifulocationsSchema = Joi.object({
    waifulocation: Joi.object({
        name: Joi.string().required().escapeHTML(),
        // image: Joi.string(),
        age: Joi.number().required().min(0),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML()
    }).required(),
    deleteImages: Joi.array()
})

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        score: Joi.number().required().min(0).max(10),
        body: Joi.string().required().escapeHTML(),
    }).required()
})