export type AgreementType = 'tos' | 'sla';

export interface LegalDocument {
  id: string;
  type: AgreementType;
  title: string;
  content: string; // markdown
  version: string;
  serviceId: string | null; // null = global
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type LegalDocumentInsert = Omit<LegalDocument, 'id' | 'createdAt' | 'updatedAt'>;
export type LegalDocumentUpdate = Partial<LegalDocumentInsert>;

export interface UserAgreement {
  id: string;
  userId: string;
  documentId: string;
  subscriptionId: string | null;
  agreedAt: string;
  ipAddress: string | null;
  // Joined fields
  document?: {
    type: AgreementType;
    title: string;
    version: string;
  };
  userEmail?: string;
}
