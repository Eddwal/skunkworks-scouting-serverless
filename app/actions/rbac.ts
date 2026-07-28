'use server';

import { adminAuth } from '@/lib/firebase/firebase-admin';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { getAuthenticatedApp } from '@/lib/firebase/firebase-server';

async function verifyAdmin() {
  const { currentUser } = await getAuthenticatedApp();
  
  if (!currentUser) {
    throw new Error('Unauthorized');
  }

  const userRecord = await adminAuth.getUser(currentUser.uid);
  
  if (!userRecord.customClaims?.admin) {
    throw new Error('Forbidden: Admin access required');
  }

  return userRecord;
}

export type UserData = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  admin: boolean;
  creationTime: string;
  lastSignInTime: string | null;
};

export async function getUsers(): Promise<UserData[]> {
  await verifyAdmin();

  const listUsersResult = await adminAuth.listUsers(1000);
  
  return listUsersResult.users.map((user) => ({
    uid: user.uid,
    email: user.email || null,
    displayName: user.displayName || null,
    photoURL: user.photoURL || null,
    admin: user.customClaims?.admin === true,
    creationTime: user.metadata.creationTime,
    lastSignInTime: user.metadata.lastSignInTime || null,
  }));
}

export async function deleteUser(uid: string) {
  const caller = await verifyAdmin();
  if (caller.uid === uid) {
    throw new Error("You cannot delete your own account");
  }

  await adminAuth.deleteUser(uid);
  revalidatePath('/manage-users');
}

export async function promoteUser(uid: string) {
  await verifyAdmin();
  const user = await adminAuth.getUser(uid);
  const currentClaims = user.customClaims || {};
  await adminAuth.setCustomUserClaims(uid, { ...currentClaims, admin: true });
  revalidatePath('/manage-users');
  return { success: true, message: `User ${uid} is now an admin.` };
}

export async function demoteUser(uid: string) {
  const caller = await verifyAdmin();
  if (caller.uid === uid) {
    throw new Error("You cannot demote your own account");
  }

  const user = await adminAuth.getUser(uid);
  const currentClaims = user.customClaims || {};
  
  // Remove admin claim
  const newClaims = { ...currentClaims };
  delete newClaims.admin;
  
  if (Object.keys(newClaims).length === 0) {
    // If no other claims exist, pass null to clear all claims
    await adminAuth.setCustomUserClaims(uid, null);
  } else {
    await adminAuth.setCustomUserClaims(uid, newClaims);
  }
  revalidatePath('/manage-users');
  return { success: true, message: `User ${uid} is no longer an admin.` };
}

// Preserve existing functions from old rbac.ts for compatibility if needed elsewhere
export async function makeUserAdmin(targetUid: string) {
  return promoteUser(targetUid);
}

export async function removeUserAdmin(targetUid: string) {
  return demoteUser(targetUid);
}

export async function createUser(data: { email: string, displayName: string, password?: string }) {
  await verifyAdmin();
  
  await adminAuth.createUser({
    email: data.email,
    displayName: data.displayName,
    password: data.password || Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8), // Generate random password if not provided
  });
  
  revalidatePath('/manage-users');
}