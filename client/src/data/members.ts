export type MemberRole = 'Owner' | 'Tenant' | 'Committee';

export type Member = {
  id: string;
  name: string;
  unit: string;
  phone: string; // E.164 with country code, e.g. '+919876543210'
  role: MemberRole;
  email?: string;
};

/**
 * Mock resident data. In a real deployment this would come from the
 * backend / society records. Phone numbers follow Indian E.164 format
 * so the WhatsApp link helper can strip and use them directly.
 */
export const MEMBERS: Member[] = [
  {
    id: 'm-001',
    name: 'Rajesh Sukhwani',
    unit: 'A-101',
    phone: '+919876543210',
    role: 'Committee',
    email: 'rajesh.s@sukhwani.example',
  },
  {
    id: 'm-002',
    name: 'Priya Sukhwani',
    unit: 'A-102',
    phone: '+919876543211',
    role: 'Owner',
  },
  {
    id: 'm-003',
    name: 'Anil Kulkarni',
    unit: 'A-201',
    phone: '+919876543212',
    role: 'Committee',
    email: 'anil.k@sukhwani.example',
  },
  {
    id: 'm-004',
    name: 'Sneha Kulkarni',
    unit: 'A-201',
    phone: '+919876543213',
    role: 'Owner',
  },
  {
    id: 'm-005',
    name: 'Vivek Deshmukh',
    unit: 'A-301',
    phone: '+919876543214',
    role: 'Owner',
  },
  {
    id: 'm-006',
    name: 'Meera Deshmukh',
    unit: 'A-301',
    phone: '+919876543215',
    role: 'Tenant',
  },
  {
    id: 'm-007',
    name: 'Sandeep Patil',
    unit: 'B-104',
    phone: '+919876543216',
    role: 'Committee',
    email: 'sandeep.p@sukhwani.example',
  },
  {
    id: 'm-008',
    name: 'Asha Patil',
    unit: 'B-104',
    phone: '+919876543217',
    role: 'Owner',
  },
  {
    id: 'm-009',
    name: 'Nikhil Joshi',
    unit: 'B-204',
    phone: '+919876543218',
    role: 'Owner',
  },
  {
    id: 'm-010',
    name: 'Pooja Joshi',
    unit: 'B-204',
    phone: '+919876543219',
    role: 'Owner',
  },
  {
    id: 'm-011',
    name: 'Manoj Puranik',
    unit: 'B-305',
    phone: '+919876543220',
    role: 'Tenant',
  },
  {
    id: 'm-012',
    name: 'Kavita Puranik',
    unit: 'B-305',
    phone: '+919876543221',
    role: 'Tenant',
  },
  {
    id: 'm-013',
    name: 'Suresh Bhandari',
    unit: 'C-101',
    phone: '+919876543222',
    role: 'Owner',
  },
  {
    id: 'm-014',
    name: 'Lata Bhandari',
    unit: 'C-101',
    phone: '+919876543223',
    role: 'Owner',
  },
  {
    id: 'm-015',
    name: 'Aditya Kshirsagar',
    unit: 'C-203',
    phone: '+919876543224',
    role: 'Owner',
  },
  {
    id: 'm-016',
    name: 'Rutuja Kshirsagar',
    unit: 'C-203',
    phone: '+919876543225',
    role: 'Owner',
  },
  {
    id: 'm-017',
    name: 'Hemant Wagh',
    unit: 'C-305',
    phone: '+919876543226',
    role: 'Committee',
    email: 'hemant.w@sukhwani.example',
  },
  {
    id: 'm-018',
    name: 'Vidya Wagh',
    unit: 'C-305',
    phone: '+919876543227',
    role: 'Owner',
  },
];

export const MEMBER_COUNT = MEMBERS.length;
export const COMMITTEE_COUNT = MEMBERS.filter((m) => m.role === 'Committee').length;
