import { z } from "zod";

export const staffSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    address: z.string(),
});

export const validateStaff = (data: unknown) => {
    const result = staffSchema.safeParse(data);
    if (!result.success) return { error: result.error.format() };
    return { value: result.data };
};
