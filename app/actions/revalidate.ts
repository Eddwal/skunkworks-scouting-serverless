'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateTeamViewer() {
  try {
    revalidatePath('/team-viewer');
  } catch (error) {
    console.error('Failed to revalidate team-viewer cache:', error);
  }
}
