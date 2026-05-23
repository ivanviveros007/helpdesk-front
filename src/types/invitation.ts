export interface Invitation {
  id: string;
  token: string;
  email: string;
  org_id: string;
  role: string;
  used: boolean;
  expires_at: string;
  created_at: string;
}

export interface InviteInfo {
  email: string;
  org_nombre: string;
  org_id: string;
}
