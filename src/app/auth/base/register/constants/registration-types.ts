export const REGISTRATION_TYPES = {
  INDIVIDUAL: 'individual',
  CLINIC: 'clinic'
} as const;

export type RegistrationType = typeof REGISTRATION_TYPES[keyof typeof REGISTRATION_TYPES];