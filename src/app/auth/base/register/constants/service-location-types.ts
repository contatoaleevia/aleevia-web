export const SERVICE_LOCATION_TYPES = {
    ONLINE: 'online',
    PRESENCIAL: 'presencial',
  } as const;
  
  export type ServiceLocationType = typeof SERVICE_LOCATION_TYPES[keyof typeof SERVICE_LOCATION_TYPES]; 