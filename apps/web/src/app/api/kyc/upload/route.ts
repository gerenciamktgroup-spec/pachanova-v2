import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const isDemo = process.env.NEXT_PUBLIC_IS_DEMO === 'true' || process.env.DEMO_MODE === 'true';

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const documentType = (formData.get('documentType') as string) || 'identity';
    const investorId = formData.get('investorId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (!investorId) {
      return NextResponse.json({ error: 'investorId required' }, { status: 400 });
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ success: true, url: 'mock://kyc-doc', message: 'Mock upload (no Supabase)' });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `${investorId}/${documentType}_${Date.now()}.${ext}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Intentar subir al bucket kyc-documents
    const { error: uploadError } = await supabaseAdmin.storage
      .from('kyc-documents')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: true,
      });

    let fileUrl: string;

    if (uploadError) {
      // Si el bucket no existe, guardar URL de referencia sin storage
      console.warn('Storage upload failed (bucket may not exist):', uploadError.message);
      fileUrl = `pending://kyc/${investorId}/${documentType}`;
    } else {
      const { data: urlData } = supabaseAdmin.storage
        .from('kyc-documents')
        .getPublicUrl(fileName);
      fileUrl = urlData.publicUrl;
    }

    // Actualizar o crear registro KYC en BD
    await supabaseAdmin.from('kyc_documents').upsert({
      investor_id: investorId,
      document_type: documentType,
      file_url: fileUrl,
      status: 'pending',
      is_demo: isDemo,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'investor_id,document_type' });

    // Actualizar kyc_status del inversor a 'pending' (tiene doc subido)
    await supabaseAdmin.from('investors').update({
      kyc_status: 'pending',
    }).eq('id', investorId);

    await supabaseAdmin.from('audit_logs').insert({
      action: 'KYC_DOCUMENT_UPLOADED',
      details: `KYC document uploaded for investor ${investorId}. Type: ${documentType}`,
    });

    return NextResponse.json({ success: true, url: fileUrl, documentType });
  } catch (error) {
    console.error('KYC upload error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
