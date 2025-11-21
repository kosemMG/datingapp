export interface Member {
  id: string;
  dateOfBirth: string;
  imageUrl?: string;
  displayName: string;
  created: string;
  lastActive: string;
  gender: string;
  description?: string;
  city: string;
  country: string;
}

export interface EditableMember {
  displayName: string;
  description?: string;
  city: string;
  country: string;
}

export class MemberParams {
  gender?: 'male' | 'female';
  minAge = 18;
  maxAge = 100;
  pageNumber = 1;
  pageSize = 10;
  orderBy: 'created' | 'lastActive' = 'lastActive';
}