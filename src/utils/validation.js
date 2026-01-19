/**
 * Validation Utility Functions
 * 
 * This file provides reusable validation helper functions that work with Zod schemas.
 * These utilities are designed to integrate seamlessly with React form state management.
 * 
 * Features:
 * - Step-based validation for multi-step forms
 * - Single field validation for real-time feedback
 * - Full form validation for submission
 * - Error message extraction and formatting
 * 
 * @module utils/validation
 */

import { stepSchemas, stepFields, fullFormSchema } from '../schemas/shipmentValidation';

// =============================================================================
// ERROR EXTRACTION UTILITIES
// =============================================================================

/**
 * Extracts error messages from a Zod validation result
 * Converts Zod's error format to a simple {fieldName: errorMessage} object
 * 
 * @param {import('zod').ZodError} zodError - The Zod error object
 * @returns {Object} Object with field names as keys and error messages as values
 * 
 * @example
 * const errors = extractErrors(result.error);
 * // Returns: { email: 'Invalid email', phone: 'Phone is required' }
 */
export const extractErrors = (zodError) => {
  const errors = {};
  
  if (zodError && zodError.issues) {
    zodError.issues.forEach((issue) => {
      // Get the field name from the path
      const fieldName = issue.path[0];
      // Only set the first error for each field
      if (fieldName && !errors[fieldName]) {
        errors[fieldName] = issue.message;
      }
    });
  }
  
  return errors;
};

// =============================================================================
// STEP VALIDATION
// =============================================================================

/**
 * Validates all fields in a specific form step
 * 
 * @param {number} step - The step number (1, 2, or 3)
 * @param {Object} formData - The complete form data object
 * @returns {{ isValid: boolean, errors: Object }} Validation result with errors
 * 
 * @example
 * const { isValid, errors } = validateStep(1, formData);
 * if (!isValid) {
 *   setErrors(errors);
 * }
 */
export const validateStep = (step, formData) => {
  const schema = stepSchemas[step];
  
  if (!schema) {
    console.warn(`No schema found for step ${step}`);
    return { isValid: true, errors: {} };
  }
  
  // Extract only the fields relevant to this step
  const stepData = {};
  stepFields[step].forEach((field) => {
    stepData[field] = formData[field];
  });
  
  const result = schema.safeParse(stepData);
  
  if (result.success) {
    return { isValid: true, errors: {} };
  }
  
  return {
    isValid: false,
    errors: extractErrors(result.error),
  };
};

// =============================================================================
// SINGLE FIELD VALIDATION
// =============================================================================

/**
 * Validates a single field for real-time validation (on blur)
 * 
 * @param {string} fieldName - The name of the field to validate
 * @param {*} value - The current value of the field
 * @param {Object} formData - The complete form data (for context if needed)
 * @returns {string} Error message if invalid, empty string if valid
 * 
 * @example
 * const error = validateField('senderEmail', 'invalid-email', formData);
 * // Returns: 'Please enter a valid email address'
 */
export const validateField = (fieldName, value, formData) => {
  // Determine which step this field belongs to
  let step = null;
  for (const [stepNum, fields] of Object.entries(stepFields)) {
    if (fields.includes(fieldName)) {
      step = parseInt(stepNum);
      break;
    }
  }
  
  if (!step) {
    return ''; // Field not found in any schema
  }
  
  const schema = stepSchemas[step];
  
  // Create a shape with just this field
  const fieldSchema = schema.shape[fieldName];
  
  if (!fieldSchema) {
    return ''; // Field not in schema
  }
  
  const result = fieldSchema.safeParse(value);
  
  if (result.success) {
    return '';
  }
  
  // Return the first error message
  return result.error.issues[0]?.message || 'Invalid value';
};

// =============================================================================
// FULL FORM VALIDATION
// =============================================================================

/**
 * Validates the entire form (all steps)
 * Useful for final submission validation
 * 
 * @param {Object} formData - The complete form data object
 * @returns {{ isValid: boolean, errors: Object, firstErrorStep: number|null }}
 * 
 * @example
 * const { isValid, errors, firstErrorStep } = validateFullForm(formData);
 * if (!isValid) {
 *   setErrors(errors);
 *   setCurrentStep(firstErrorStep);
 * }
 */
export const validateFullForm = (formData) => {
  const result = fullFormSchema.safeParse(formData);
  
  if (result.success) {
    return { isValid: true, errors: {}, firstErrorStep: null };
  }
  
  const errors = extractErrors(result.error);
  
  // Determine which step has the first error
  let firstErrorStep = null;
  const errorFields = Object.keys(errors);
  
  for (const [stepNum, fields] of Object.entries(stepFields)) {
    if (fields.some((field) => errorFields.includes(field))) {
      firstErrorStep = parseInt(stepNum);
      break;
    }
  }
  
  return { isValid: false, errors, firstErrorStep };
};

