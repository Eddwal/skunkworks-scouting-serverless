'use server'

import { headers } from 'next/headers';
import { adminAuth } from '@/lib/firebase/firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

export async function deleteEvent(eventKey: string, clientToken?: string) {
  const headersList = await headers();
  const token = clientToken || headersList.get('Authorization')?.split('Bearer ')[1];
  
  if (!token) throw new Error("Unauthorized");
  
  let decodedToken;
  try {
    decodedToken = await adminAuth.verifyIdToken(token);
  } catch (err: any) {
    throw new Error(`Auth verification failed: ${err.message}`);
  }
  
  if (!decodedToken.admin) throw new Error("Forbidden: Only users with admin claim may delete events");

  const db = getFirestore();
  const eventRef = db.collection('events').doc(eventKey);
  
  try {
    const matchesSnapshot = await eventRef.collection('matches').get();
    
    const batches = [];
    let currentBatch = db.batch();
    let count = 0;

    matchesSnapshot.docs.forEach((doc) => {
      currentBatch.delete(doc.ref);
      count++;
      if (count === 500) {
        batches.push(currentBatch.commit());
        currentBatch = db.batch();
        count = 0;
      }
    });

    if (count > 0) {
      batches.push(currentBatch.commit());
    }

    await Promise.all(batches);
    
    await eventRef.delete();
    
    return { success: true, message: `Successfully deleted event ${eventKey}` };
  } catch (err: any) {
    throw new Error(`Failed to delete event: ${err.message}`);
  }
}
