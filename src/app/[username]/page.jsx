import React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import BioPage, { generateMetadata as bioGenerateMetadata } from '../bio/[username]/page';

export const generateMetadata = bioGenerateMetadata;

export const dynamic = 'force-dynamic';

export default async function Page({ params }) {
  const { username } = await params;

  if (!username) {
    return notFound();
  }

  // Verify that the username exists in the database
  const supabase = createClient();
  const { data: account } = await supabase
    .from('automations')
    .select('id')
    .ilike('page_name', username)
    .single();

  if (!account) {
    const isDev = process.env.NODE_ENV === 'development';
    if (!isDev) {
      return notFound();
    }
  }

  // Render the bio page component
  return <BioPage params={params} />;
}
