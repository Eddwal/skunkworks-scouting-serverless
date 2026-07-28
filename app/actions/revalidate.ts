'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

export async function revalidateDashboards() {
  try {
    revalidatePath('/team-viewer');
    revalidatePath('/standings');
    revalidatePath('/pre-match-dashboard');
    revalidateTag('standings', 'max');
    revalidateTag('events', 'max');
  } catch (error) {
    console.error('Failed to revalidate dashboard caches:', error);
  }
}

