'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';

import CustomButton from 'app/common/CustomButton';
import FormDropzone from 'app/common/FormDropzone';
import { type JsonAddInput } from 'schemas/jsonAdd';

const FormDropzoneFields: React.FC = () => {
  const { append, fields, remove } = useFieldArray<JsonAddInput, 'files'>({ name: 'files' });
  const { watch } = useFormContext<JsonAddInput>();
  const files = watch('files');
  const lastField = files[files.length - 1];

  const handleAppend = () => {
    // it is not the most beautiful solution, but it works
    // we need to allow user to insert his own file but we also don't want to break validation
    append({ file: undefined });
  };

  return (
    <>
      {fields.map((field, index) => (
        <FormDropzone remove={() => remove(index)} key={field.id} name={`files.${index}.file`} />
      ))}
      {lastField?.file && <CustomButton text="Dodaj nowy plik" onClick={handleAppend} />}
    </>
  );
};

export default FormDropzoneFields;
