/**
 * Schema Exports
 * 
 * Central export file for all validation schemas.
 * Import from here for cleaner imports in components.
 * 
 * @example
 * import { step1Schema, stepFields } from '../schemas';
 */

export {
  // Reusable validators
  emailValidator,
  phoneValidator,
  pincodeValidator,
  requiredString,
  optionalString,
  positiveNumberString,
  
  // Step schemas
  step1Schema,
  step2Schema,
  step3Schema,
  
  // Combined schema
  fullFormSchema,
  
  // Field mappings
  stepFields,
  stepSchemas,
} from './shipmentValidation';

