import { z } from 'zod';

export const jsonAddSchema = z.object({
  name: z.string().min(1),
  file: z
    .custom<File>()
    .refine((file) => !!file, 'File is required')
    .refine((file) => file?.type === 'application/json', 'File must be a JSON file')
});

export type JsonAddInput = z.infer<typeof jsonAddSchema>;
