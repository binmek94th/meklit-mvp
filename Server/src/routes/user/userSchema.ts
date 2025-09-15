import { z } from "zod";

export const userSchema = z.object({
    last_name: z.string(),
    first_name: z.string().email(),
});

export const validateStaff = (data: unknown) => {
    const result = userSchema.safeParse(data);
    if (!result.success) return { error: result.error.format() };
    return { value: result.data };
};
