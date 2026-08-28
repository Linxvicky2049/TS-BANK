const { z } = require("zod");

const bvnSchema = z.object({
  bvn: z
    .string()
    .regex(
      /^\d{11}$/,
      "BVN must contain exactly 11 digits"
    ),

  firstName: z
    .string()
    .trim()
    .min(1),

  lastName: z
    .string()
    .trim()
    .min(1),

  phone: z
    .string()
    .trim()
    .min(7),
});

const ninSchema = z.object({
  nin: z
    .string()
    .regex(
      /^\d{11}$/,
      "NIN must contain exactly 11 digits"
    ),

  firstName: z
    .string()
    .trim()
    .min(1),

  lastName: z
    .string()
    .trim()
    .min(1),
});

module.exports = {
  bvnSchema,
  ninSchema,
};