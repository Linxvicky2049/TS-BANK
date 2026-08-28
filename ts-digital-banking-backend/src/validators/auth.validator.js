const { z } = require("zod");

const registerSchema = z.object({
  body: z.object({
    fullName: z.string().trim().min(2).max(100),
    email: z.string().trim().email().toLowerCase(),
    phone: z.string().trim().min(10).max(15),
    password: z.string().min(8).max(128),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email().toLowerCase(),
    password: z.string().min(1),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
};