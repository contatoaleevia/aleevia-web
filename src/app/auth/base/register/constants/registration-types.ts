export const REGISTRATION_TYPES = {
  INDIVIDUAL: 'individual',
  CLINIC: 'clinic'
} as const;

export type RegistrationType = typeof REGISTRATION_TYPES[keyof typeof REGISTRATION_TYPES];

export const SERVICE_LOCATION_TYPES = {
  ONLINE: 'online',
  PRESENCIAL: 'presencial',
} as const;

export type ServiceLocationType = typeof SERVICE_LOCATION_TYPES[keyof typeof SERVICE_LOCATION_TYPES]; 