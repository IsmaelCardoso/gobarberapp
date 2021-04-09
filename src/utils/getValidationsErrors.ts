import { ValidationError } from 'yup';
import { object } from 'yup/lib/locale';

interface Errors {
  [key: string]: string;
}

const getValidatonsErrors = (err: ValidationError): Errors => {
  const validationErrors: Errors = {};

  err.inner.forEach((error: any) => {
    validationErrors[error.path] = error.message;
  });

  return validationErrors;
};

export default getValidatonsErrors;
