'use server';

import { db } from '@/db';
import { document, tender, project } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { StorageService } from '@/lib/storage';
import { nanoid } from 'nanoid';

// Upload a document
export async function uploadDocument(
  organizationId: string,
  formData: FormData,
  linkedEntity?: { tenderId?: string; projectId?: string }
) {
  try {
    // 1. Check Session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.session.activeOrganizationId) {
      return { success: false, error: 'Unauthorized' };
    }

    if (session.session.activeOrganizationId !== organizationId) {
      return { success: false, error: 'Unauthorized organization access' };
    }

    const userId = session.user.id;

    // 2. Extract File
    const file = formData.get('file') as File;
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    // 3. Determine Storage Path
    const fileExtension = file.name.split('.').pop();
    let uniqueKey = `${organizationId}/${nanoid()}.${fileExtension}`; // Default fallback

    if (linkedEntity?.tenderId) {
      const parentTender = await db.query.tender.findFirst({
        where: eq(tender.id, linkedEntity.tenderId),
        columns: { tenderNumber: true },
      });
      if (parentTender?.tenderNumber) {
        uniqueKey = `tenders/${parentTender.tenderNumber}/${file.name}`;
      }
    } else if (linkedEntity?.projectId) {
      const parentProject = await db.query.project.findFirst({
        where: eq(project.id, linkedEntity.projectId),
        columns: { projectNumber: true },
      });
      if (parentProject?.projectNumber) {
        uniqueKey = `projects/${parentProject.projectNumber}/${file.name}`;
      }
    }

    // 4. Upload to Storage
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Perform upload
    const storageKey = await StorageService.uploadFile(
      buffer,
      uniqueKey,
      file.type
    );

    // 5. Save to Database
    const newDocument = await db
      .insert(document)
      .values({
        id: nanoid(),
        organizationId,
        name: file.name,
        url: storageKey, // Saving the storage key as the URL (or path)
        size: file.size.toString(),
        type: file.type,
        tenderId: linkedEntity?.tenderId,
        projectId: linkedEntity?.projectId,
        uploadedBy: userId,
      })
      .returning();

    // 6. Revalidate
    if (linkedEntity?.tenderId) {
      revalidatePath(`/dashboard/tenders/${linkedEntity.tenderId}`);
    }
    // if projectId...

    return { success: true, document: newDocument[0] };
  } catch (error) {
    console.error('Error uploading document:', error);
    return { success: false, error: 'Failed to upload document' };
  }
}

// Get documents for a tender/project
export async function getDocuments(
  organizationId: string,
  entityType: 'tender' | 'project',
  entityId: string
) {
  try {
    const whereCondition = and(
      eq(document.organizationId, organizationId),
      entityType === 'tender'
        ? eq(document.tenderId, entityId)
        : eq(document.projectId, entityId)
    );

    const docs = await db.select().from(document).where(whereCondition);

    // Enhance docs with signed URLs if necessary (assuming private bucket)
    // For public buckets, we can construct the URL.
    // Assuming private for now as per StorageService.

    const enhancedDocs = await Promise.all(
      docs.map(async (doc) => {
        const signedUrl = await StorageService.getSignedUrl(doc.url);
        return {
          ...doc,
          signedUrl, // Use this for display/download
        };
      })
    );

    return { success: true, documents: enhancedDocs };
  } catch (error) {
    console.error('Error fetching documents:', error);
    return { success: false, error: 'Failed to fetch documents' };
  }
}

// Delete a document
export async function deleteDocument(
  organizationId: string,
  documentId: string
) {
  try {
    // 1. Check Session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.session.activeOrganizationId) {
      return { success: false, error: 'Unauthorized' };
    }

    // 2. Fetch Document to get Storage Key
    const targetDoc = await db
      .select()
      .from(document)
      .where(
        and(
          eq(document.id, documentId),
          eq(document.organizationId, organizationId)
        )
      )
      .limit(1);

    if (targetDoc.length === 0) {
      return { success: false, error: 'Document not found' };
    }

    const docToDelete = targetDoc[0];

    // 3. Delete from Storage
    await StorageService.deleteFile(docToDelete.url);

    // 4. Delete from DB
    await db.delete(document).where(eq(document.id, documentId));

    revalidatePath('/dashboard/tenders');
    if (docToDelete.tenderId)
      revalidatePath(`/dashboard/tenders/${docToDelete.tenderId}`);

    return { success: true, message: 'Document deleted' };
  } catch (error) {
    console.error('Error deleting document:', error);
    return { success: false, error: 'Failed to delete document' };
  }
}
