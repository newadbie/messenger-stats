'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import { Toaster, toast } from 'sonner';

import CustomButton from 'app/common/CustomButton';
import FormDropzone from 'app/common/FormDropzone';
import FormInput from 'app/common/FormInput';
import { type JsonAddInput, jsonAddSchema } from 'schemas/jsonAdd';

import FormDropzoneFields from './FormDropzoneFields';

const postAddJson = async (data: JsonAddInput) => {
  const formData = new FormData();
  data.files.forEach(({ file }) => {
    if (!file) return;
    formData.append('files', file);
  });

  formData.append('name', data.name);

  try {
    const response = await fetch('/api/upload-json', {
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error('Something went wrong');
  } catch (e) {
    throw e;
  }
};

const AddForm: React.FC = () => {
  const { mutate, isLoading } = useMutation(['/api/upload-json'], postAddJson);
  const methods = useForm<JsonAddInput>({
    resolver: zodResolver(jsonAddSchema),
    defaultValues: { files: [{ file: undefined }] },
    mode: 'onBlur'
  });

  const onSubmit: SubmitHandler<JsonAddInput> = (data) => {
    console.log('Fine');
    mutate(data, {
      onError: () => {
        toast.error('Coś poszło nie tak');
      },
      onSuccess: () => {
        toast.success('Dodano');
      }
    });
  };

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="flex w-full flex-col space-y-4">
          <FormInput<keyof JsonAddInput> name="name" label="Tytuł importu" />
          <FormDropzoneFields />
          <CustomButton text="Wyślij" type="submit" className="mt-4" loading={isLoading} />
        </form>
      </FormProvider>
      <Toaster richColors theme="dark" />
    </>
  );
};

export default AddForm;
