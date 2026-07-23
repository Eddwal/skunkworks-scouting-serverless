import { adminAuth } from '@/lib/firebase/firebase-admin';

export async function makeUserAdmin(targetUid: string) {
  await adminAuth.setCustomUserClaims(targetUid, { admin: true });
  
  return { success: true, message: `User ${targetUid} is now an admin.` };
}

export async function removeUserAdmin(targetUid: string) {
  await adminAuth.setCustomUserClaims(targetUid, { admin: false });
  
  return { success: true, message: `User ${targetUid} is no longer an admin.` };
}