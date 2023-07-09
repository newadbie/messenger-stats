import { z } from 'zod';

export const jsonAddSchema = z.object({
  name: z.string().min(1),
  files: z.array(
    z.object({
      file: z
        .custom<File>()
        .nullish()
        .refine((file) => !!file, 'File is required')
        .refine((file) => file?.type === 'application/json', 'File must be a JSON file')
    })
  )
});

export const backendJsonAddSchema = z.object({
  name: z.string().min(1)
});

export const fileSchema = z
  .custom<File>()
  .refine((file) => !!file, 'File is required')
  .refine((file) => file?.type === 'application/json', 'File must be a JSON file');

export type JsonAddInput = z.infer<typeof jsonAddSchema>;
