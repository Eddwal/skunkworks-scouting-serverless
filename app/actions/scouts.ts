'use server';

import { adminDb } from '@/lib/firebase/firebase-admin';
import { verifyAdmin } from './rbac';
import { revalidateTag } from 'next/cache';

export interface ScoutData {
  id: string;
  name: string;
  createdAt: string;
}

export async function getScouts(): Promise<ScoutData[]> {
  const snapshot = await adminDb.collection('scouts').orderBy('name', 'asc').get();
  return snapshot.docs.map(doc => ({
    id: doc.id,
    name: doc.data().name,
    createdAt: doc.data().createdAt,
  }));
}

export async function createScout(name: string) {
  await verifyAdmin();
  
  if (!name || name.trim() === '') {
    throw new Error('Scout name is required');
  }

  const newScoutRef = adminDb.collection('scouts').doc();
  await newScoutRef.set({
    name: name.trim(),
    createdAt: new Date().toISOString(),
  });
  
  revalidateTag('scouts', 'max');
  return { success: true, id: newScoutRef.id };
}

export async function deleteScout(id: string) {
  await verifyAdmin();
  
  if (!id) {
    throw new Error('Scout ID is required');
  }

  await adminDb.collection('scouts').doc(id).delete();
  
  revalidateTag('scouts', 'max');
  return { success: true };
}

export async function bulkCreateScouts(names: string[]) {
  await verifyAdmin();
  
  if (!names || names.length === 0) {
    throw new Error('Scout names are required');
  }

  const batch = adminDb.batch();
  const collectionRef = adminDb.collection('scouts');
  const now = new Date().toISOString();

  names.forEach(name => {
    const trimmed = name.trim();
    if (trimmed) {
      const docRef = collectionRef.doc();
      batch.set(docRef, {
        name: trimmed,
        createdAt: now,
      });
    }
  });

  await batch.commit();
  revalidateTag('scouts', 'max');
  return { success: true };
}

export async function bulkDeleteScouts(ids: string[]) {
  await verifyAdmin();
  
  if (!ids || ids.length === 0) {
    throw new Error('Scout IDs are required');
  }

  const batch = adminDb.batch();
  const collectionRef = adminDb.collection('scouts');

  ids.forEach(id => {
    batch.delete(collectionRef.doc(id));
  });

  await batch.commit();
  revalidateTag('scouts', 'max');
  return { success: true };
}
