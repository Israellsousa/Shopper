import Joi from 'joi';

// Define schemas for validation
const uploadSchema = Joi.object({
  image: Joi.string().base64().required(),
  customer_code: Joi.string().required(),
  measure_datetime: Joi.date().iso().required(), // Ensure ISO date format
  measure_type: Joi.string().valid('WATER', 'GAS').required(),
});

const confirmSchema = Joi.object({
  measure_uuid: Joi.string().required(),
  confirmed_value: Joi.number().integer().required(),
});

// TypeScript types for validation results
interface ValidationResult<T> {
  error: string | null;
  value: T;
}

// TypeScript interfaces for request bodies
interface UploadRequestBody {
  image: string;
  customer_code: string;
  measure_datetime: string; // ISO date string
  measure_type: 'WATER' | 'GAS';
}

interface ConfirmRequestBody {
  measure_uuid: string;
  confirmed_value: number;
}

// Function to validate upload requests
export function validateUploadRequest(body: UploadRequestBody): ValidationResult<UploadRequestBody> {
  const { error, value } = uploadSchema.validate(body);
  return { error: error ? error.details[0].message : null, value };
}

// Function to validate confirm requests
export function validateConfirmRequest(body: ConfirmRequestBody): ValidationResult<ConfirmRequestBody> {
  const { error, value } = confirmSchema.validate(body);
  return { error: error ? error.details[0].message : null, value };
}
