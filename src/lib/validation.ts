export interface ValidationError {
  field: string;
  message: string;
}

export class ValidationErrors extends Error {
  errors: ValidationError[];

  constructor(errors: ValidationError[]) {
    super('Validation failed');
    this.errors = errors;
  }
}

export function validateCardData(data: any): ValidationError[] {
  const errors: ValidationError[] = [];

  // Card Name validation
  if (!data.name) {
    errors.push({
      field: 'name',
      message: 'Card name is required'
    });
  } else if (data.name.length < 3) {
    errors.push({
      field: 'name',
      message: 'Card name must be at least 3 characters long'
    });
  }

  // Bank Name validation
  if (!data.bankName) {
    errors.push({
      field: 'bankName',
      message: 'Bank name is required'
    });
  }

  // Card Number validation
  if (!data.cardNumber) {
    errors.push({
      field: 'cardNumber',
      message: 'Last 4 digits of card number are required'
    });
  } else if (!/^\d{4}$/.test(data.cardNumber)) {
    errors.push({
      field: 'cardNumber',
      message: 'Card number must be exactly 4 digits'
    });
  }

  // Offers validation
  if (!Array.isArray(data.offers) || data.offers.length === 0) {
    errors.push({
      field: 'offers',
      message: 'At least one offer is required'
    });
  } else {
    data.offers.forEach((offer: any, index: number) => {
      if (!offer.merchantCategory) {
        errors.push({
          field: `offers[${index}].merchantCategory`,
          message: 'Merchant category is required'
        });
      }

      if (typeof offer.percentage !== 'number') {
        errors.push({
          field: `offers[${index}].percentage`,
          message: 'Percentage must be a number'
        });
      } else if (offer.percentage < 0 || offer.percentage > 100) {
        errors.push({
          field: `offers[${index}].percentage`,
          message: 'Percentage must be between 0 and 100'
        });
      }
    });
  }

  return errors;
}

export function formatValidationErrors(errors: ValidationError[]): string {
  if (errors.length === 0) return '';
  
  if (errors.length === 1) {
    return errors[0].message;
  }

  return errors
    .map(error => `• ${error.message}`)
    .join('\n');
}