import type { LegalDocument, LegalDocumentInsert, LegalDocumentUpdate, UserAgreement, AgreementType } from '@/types/legal';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getItem, setItem, StorageKeys, generateId } from './storage';
import { defaultLegalDocuments } from './seedData';

function dbRowToLegalDocument(row: any): LegalDocument {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    content: row.content,
    version: row.version,
    serviceId: row.service_id,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function dbRowToAgreement(row: any): UserAgreement {
  return {
    id: row.id,
    userId: row.user_id,
    documentId: row.document_id,
    subscriptionId: row.subscription_id,
    agreedAt: row.agreed_at,
    ipAddress: row.ip_address,
    document: row.legal_documents
      ? {
          type: row.legal_documents.type,
          title: row.legal_documents.title,
          version: row.legal_documents.version,
        }
      : undefined,
    userEmail: row.user_profiles?.email,
  };
}

function getLocalDocuments(): LegalDocument[] {
  const stored = getItem<LegalDocument[]>(StorageKeys.LEGAL_DOCUMENTS);
  if (stored && stored.length > 0) return stored;
  // Auto-seed with defaults on first access
  setItem(StorageKeys.LEGAL_DOCUMENTS, defaultLegalDocuments);
  return defaultLegalDocuments;
}
function saveLocalDocuments(docs: LegalDocument[]): void {
  setItem(StorageKeys.LEGAL_DOCUMENTS, docs);
}
function getLocalAgreements(): UserAgreement[] {
  return getItem<UserAgreement[]>(StorageKeys.USER_AGREEMENTS) || [];
}
function saveLocalAgreements(agreements: UserAgreement[]): void {
  setItem(StorageKeys.USER_AGREEMENTS, agreements);
}

export const legalService = {
  async getDocuments(type?: AgreementType, activeOnly = true): Promise<LegalDocument[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('legal_documents').select('*');
        if (type) query = query.eq('type', type);
        if (activeOnly) query = query.eq('is_active', true);
        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;
        if (data && data.length > 0) return data.map(dbRowToLegalDocument);
      } catch (err) {
        console.warn('Supabase legal docs query failed, falling back to localStorage:', err);
      }
    }

    let docs = getLocalDocuments();
    if (type) docs = docs.filter((d) => d.type === type);
    if (activeOnly) docs = docs.filter((d) => d.isActive);
    return docs;
  },

  async getDocumentById(id: string): Promise<LegalDocument | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('legal_documents')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        console.error('Error fetching legal document:', error);
        throw error;
      }
      return data ? dbRowToLegalDocument(data) : null;
    }

    const docs = getLocalDocuments();
    return docs.find((d) => d.id === id) || null;
  },

  async getActiveDocument(type: AgreementType, serviceId?: string): Promise<LegalDocument | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase
          .from('legal_documents')
          .select('*')
          .eq('type', type)
          .eq('is_active', true);

        if (serviceId) {
          query = query.eq('service_id', serviceId);
        } else {
          query = query.is('service_id', null);
        }

        const { data, error } = await query.order('created_at', { ascending: false }).limit(1);

        if (error) throw error;
        if (data && data.length > 0) return dbRowToLegalDocument(data[0]);
      } catch (err) {
        console.warn('Supabase active legal doc query failed, falling back to localStorage:', err);
      }
    }

    const docs = getLocalDocuments();
    return (
      docs.find(
        (d) =>
          d.type === type &&
          d.isActive &&
          (serviceId ? d.serviceId === serviceId : d.serviceId === null)
      ) || null
    );
  },

  async createDocument(data: LegalDocumentInsert): Promise<LegalDocument> {
    if (isSupabaseConfigured && supabase) {
      const { data: newDoc, error } = await supabase
        .from('legal_documents')
        .insert({
          type: data.type,
          title: data.title,
          content: data.content,
          version: data.version,
          service_id: data.serviceId || null,
          is_active: data.isActive,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating legal document:', error);
        throw error;
      }
      return dbRowToLegalDocument(newDoc);
    }

    const docs = getLocalDocuments();
    const now = new Date().toISOString();
    const newDoc: LegalDocument = {
      ...data,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    docs.push(newDoc);
    saveLocalDocuments(docs);
    return newDoc;
  },

  async updateDocument(id: string, data: LegalDocumentUpdate): Promise<LegalDocument | null> {
    if (isSupabaseConfigured && supabase) {
      const updateData: any = {};
      if (data.type !== undefined) updateData.type = data.type;
      if (data.title !== undefined) updateData.title = data.title;
      if (data.content !== undefined) updateData.content = data.content;
      if (data.version !== undefined) updateData.version = data.version;
      if (data.serviceId !== undefined) updateData.service_id = data.serviceId;
      if (data.isActive !== undefined) updateData.is_active = data.isActive;

      const { data: updated, error } = await supabase
        .from('legal_documents')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating legal document:', error);
        throw error;
      }
      return updated ? dbRowToLegalDocument(updated) : null;
    }

    const docs = getLocalDocuments();
    const index = docs.findIndex((d) => d.id === id);
    if (index === -1) return null;

    docs[index] = {
      ...docs[index],
      ...data,
      id: docs[index].id,
      createdAt: docs[index].createdAt,
      updatedAt: new Date().toISOString(),
    };
    saveLocalDocuments(docs);
    return docs[index];
  },

  async deleteDocument(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('legal_documents').delete().eq('id', id);
      if (error) {
        console.error('Error deleting legal document:', error);
        throw error;
      }
      return true;
    }

    const docs = getLocalDocuments();
    const filtered = docs.filter((d) => d.id !== id);
    if (filtered.length === docs.length) return false;
    saveLocalDocuments(filtered);
    return true;
  },

  async getAgreements(userId?: string): Promise<UserAgreement[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase
        .from('user_agreements')
        .select('*, legal_documents(type, title, version), user_profiles(email)');
      if (userId) query = query.eq('user_id', userId);
      const { data, error } = await query.order('agreed_at', { ascending: false });

      if (error) {
        console.error('Error fetching agreements:', error);
        throw error;
      }
      return (data || []).map(dbRowToAgreement);
    }

    let agreements = getLocalAgreements();
    if (userId) agreements = agreements.filter((a) => a.userId === userId);
    return agreements;
  },

  async createAgreement(data: {
    userId: string;
    documentId: string;
    subscriptionId?: string;
    ipAddress?: string;
  }): Promise<UserAgreement> {
    if (isSupabaseConfigured && supabase) {
      const { data: newAgreement, error } = await supabase
        .from('user_agreements')
        .insert({
          user_id: data.userId,
          document_id: data.documentId,
          subscription_id: data.subscriptionId || null,
          ip_address: data.ipAddress || null,
        })
        .select('*, legal_documents(type, title, version)')
        .single();

      if (error) {
        console.error('Error creating agreement:', error);
        throw error;
      }
      return dbRowToAgreement(newAgreement);
    }

    const agreements = getLocalAgreements();
    const newAgreement: UserAgreement = {
      id: generateId(),
      userId: data.userId,
      documentId: data.documentId,
      subscriptionId: data.subscriptionId || null,
      agreedAt: new Date().toISOString(),
      ipAddress: data.ipAddress || null,
    };
    agreements.push(newAgreement);
    saveLocalAgreements(agreements);
    return newAgreement;
  },
};
