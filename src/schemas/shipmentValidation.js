/**
 * Shipment Form Validation Schemas
 * 
 * This file contains Zod validation schemas for the multi-step shipment form.
 * Each step has its own schema that can be validated independently.
 * 
 * Architecture:
 * - Reusable field validators (email, phone, pincode)
 * - Step-specific schemas (step1, step2, step3)
 * - Combined full form schema
 * - Utility functions for step and field validation
 * 
 * @module schemas/shipmentValidation
 */

import { z } from 'zod';

// =============================================================================
// REUSABLE FIELD VALIDATORS
// =============================================================================

/**
 * Email validation pattern
 * Validates standard email format: user@domain.tld
 */
export const emailValidator = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

/**
 * Phone validation pattern
 * Accepts: digits, spaces, +, -, (), minimum 10 characters
 * Examples: +91 98765 43210, (123) 456-7890
 */
export const phoneValidator = z
  .string()
  .min(1, 'Phone number is required')
  .regex(/^[\d\s+()-]{10,}$/, 'Please enter a valid phone number');

/**
 * Indian Pincode validation
 * Must be exactly 6 digits
 */
export const pincodeValidator = z
  .string()
  .min(1, 'Pincode is required')
  .regex(/^\d{6}$/, 'Please enter a valid 6-digit pincode');

/**
 * Required string validator factory
 * Creates a required string validator with custom field name
 * @param {string} fieldName - Name of the field for error message
 */
export const requiredString = (fieldName) =>
  z.string().min(1, `${fieldName} is required`);

/**
 * Optional string validator
 * For fields that are not required but should be strings
 */
export const optionalString = z.string().optional().default('');

/**
 * Positive number string validator
 * For numeric inputs stored as strings (weight, value)
 * @param {string} fieldName - Name of the field for error message
 */
export const positiveNumberString = (fieldName) =>
  z.string().min(1, `${fieldName} is required`);

// =============================================================================
// STEP 1: ORDER & SENDER DETAILS SCHEMA
// =============================================================================

export const step1Schema = z.object({
  // Order Details
  orderNumber: requiredString('Order number'),
  orderDate: requiredString('Order date'),
  
  // Sender Details
  senderName: requiredString('Sender name'),
  senderEmail: emailValidator,
  senderPhone: phoneValidator,
  senderAddress: requiredString('Sender address'),
  senderCity: optionalString,
  senderState: optionalString,
  senderPincode: pincodeValidator,
});

// =============================================================================
// STEP 2: RECEIVER DETAILS SCHEMA
// =============================================================================

export const step2Schema = z.object({
  receiverName: requiredString('Receiver name'),
  receiverEmail: emailValidator,
  receiverPhone: phoneValidator,
  receiverAddress: requiredString('Receiver address'),
  receiverCity: optionalString,
  receiverState: optionalString,
  receiverPincode: pincodeValidator,
});

// =============================================================================
// STEP 3: SHIPMENT DETAILS SCHEMA
// =============================================================================

export const step3Schema = z.object({
  weight: positiveNumberString('Weight'),
  itemDescription: requiredString('Item description'),
  itemValue: positiveNumberString('Item value'),
  courier: z.string().default('Delhivery'),
  serviceType: z.string().default('Standard'),
});

// =============================================================================
// COMBINED FULL FORM SCHEMA
// =============================================================================

/**
 * Full shipment form schema
 * Combines all step schemas for complete form validation
 */
export const fullFormSchema = step1Schema.merge(step2Schema).merge(step3Schema);

// =============================================================================
// FIELD MAPPINGS
// =============================================================================

/**
 * Fields belonging to each step
 * Used for marking fields as touched and step navigation
 */
export const stepFields = {
  1: ['orderNumber', 'orderDate', 'senderName', 'senderEmail', 'senderPhone', 'senderAddress', 'senderCity', 'senderState', 'senderPincode'],
  2: ['receiverName', 'receiverEmail', 'receiverPhone', 'receiverAddress', 'receiverCity', 'receiverState', 'receiverPincode'],
  3: ['weight', 'itemDescription', 'itemValue', 'courier', 'serviceType'],
};

/**
 * Schema mapping for each step
 */
export const stepSchemas = {
  1: step1Schema,
  2: step2Schema,
  3: step3Schema,
};

