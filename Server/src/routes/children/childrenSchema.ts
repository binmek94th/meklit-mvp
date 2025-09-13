import { z } from "zod";

export const childrenSchema = z.object({
    name: z.string(),
    parent_name: z.string(),
    email: z.string().email(),
    address: z.string(),
});

export const validateChildren = (data: unknown) => {
    const result = childrenSchema.safeParse(data);
    if (!result.success) return { error: result.error.format() };
    return { value: result.data };
};
