'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateTeamViewer() {
  try {
    revalidatePath('/team-viewer');
  } catch (error) {
    console.error('Failed to revalidate team-viewer cache:', error);
  }
}

import { revalidateTag } from 'next/cache';

export async function revalidateStandings() {
  try {
    // @ts-ignore - Next.js 14 typings sometimes expect 2 arguments
    revalidateTag('standings');
    revalidatePath('/standings');
  } catch (error) {
    console.error('Failed to revalidate standings cache:', error);
  }
}
