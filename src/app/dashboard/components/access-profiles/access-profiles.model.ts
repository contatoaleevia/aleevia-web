export interface AccessProfile {
  name: string;
  role: string;
  isActive: boolean;
}

export interface AccessProfilesData {
  title: string;
  profiles: AccessProfile[];
}
