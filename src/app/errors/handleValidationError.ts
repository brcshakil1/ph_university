import mongoose from 'mongoose';
import { TErrorSources } from '../interfaces/error.inerface';

const handleValidationError = (err: mongoose.Error.ValidationError) => {
  const errorSources: TErrorSources = Object.values(err.errors).map(
    (value: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: value?.path,
        message: value?.message,
      };
    },
  );

  const statusCode = 400;

  return {
    statusCode,
    message: 'validation error.',
    errorSources,
  };
};

export default handleValidationError;
