import { z } from 'zod';

const addressSchema = z.object({
    street: z.string().max(100),
    zipCode: z.string().max(20),
    state: z.string().max(100),
    city: z.string().max(100),
    country: z.string().max(100),
});

export const createBodySchema = z.object({
    fullName: z.string({
        required_error: "fullName is required",
    }).max(100).regex(/^[A-Za-z ]+$/),
    birthDate: z.string().max(10).regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'The date format should be yyyy-mm-dd' }).optional(),
    address: addressSchema.optional(),
    email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    subsidiary: z.number().optional(),
});

export const getParameterSchema = z.object({
    id: z.string().refine(id => id.length === 16, {
        message: 'Id must have exactly 16 characters',
    })
});

export const listQueryStringSchema = z.object({
    lastEvaluatedKey: z.string().optional(),
    fullName: z.string().max(100).regex(/^[A-Za-z ]+$/).optional(),
    verifiedEmail: z.string().optional(),
    gender: z.string().optional()
}).nullable();