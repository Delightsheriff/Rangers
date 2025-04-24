const { z } = require('zod');

/**
 * Middleware to validate request body against a Zod schema
 * @param {z.ZodType} schema - Zod schema to validate against
 * @returns {Function} Express middleware function
 */
const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      // Parse and validate the request body against the schema
      const validatedData = await schema.parseAsync(req.body);

      // Replace the request body with the validated data
      req.body = validatedData;

      // Continue to the next middleware
      next();
    } catch (error) {
      // If validation fails, return the errors
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }

      // For other errors, pass to the error handler
      next(error);
    }
  };
};

// Define schemas for validation
const schemas = {
  // User registration schema
  register: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),

  // User login schema
  login: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),

  // User update schema
  updateUser: z
    .object({
      firstName: z.string().min(1, 'First name is required').optional(),
      lastName: z.string().min(1, 'Last name is required').optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field (firstName or lastName) must be provided',
    }),

  // Refresh token schema
  refreshToken: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),

  // Forgot password schema
  forgotPassword: z.object({
    email: z.string().email('Invalid email address'),
  }),

  // Reset password schema
  resetPassword: z.object({
    token: z.string().min(1, 'Reset token is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
};

module.exports = {
  validateRequest,
  schemas,
};
