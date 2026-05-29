import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const automationId = searchParams.get('automationId');

  if (!automationId) {
    return NextResponse.json({ error: 'Missing automationId' }, { status: 400 });
  }

  const supabase = createClient();
  
  // Verify auth
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: products, error } = await supabase
    .from('store_products')
    .select('*')
    .eq('automation_id', automationId)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, products });
}

export async function POST(request) {
  const supabase = createClient();
  
  // Verify auth
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { automationId, name, description, price, type, fileUrl, coverImage } = body;

    if (!automationId || !name || !price || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data: product, error } = await supabase
      .from('store_products')
      .insert({
        automation_id: automationId,
        name,
        description,
        price_inr: price,
        type,
        file_url: fileUrl,
        cover_image: coverImage
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, product });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
