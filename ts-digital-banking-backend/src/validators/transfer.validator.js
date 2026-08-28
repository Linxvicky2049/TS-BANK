const { z } = require("zod");

const transferSchema = z.object({
  recipientAccountNumber: z
    .string()
    .trim()
    .min(1, "Recipient account number is required"),

  recipientBankCode: z
    .string()
    .trim()
    .optional(),

  amount: z.coerce
    .number()
    .positive("Amount must be greater than zero"),

  narration: z
    .string()
    .trim()
    .max(200)
    .optional(),
});

module.exports = {
  transferSchema,
};