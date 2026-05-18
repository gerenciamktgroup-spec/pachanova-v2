import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const documentType = (formData.get('documentType') as string) || 'identity';
    const investorId = formData.get('investorId') as string | null;

    if (!file || !investorId) {
      return NextResponse.json({ error: 'Faltan parámetros: file e investorId son requeridos' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `${investorId}/${documentType}_${Date.now()}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabaseAdmin.storage
      .from('kyc-documents')
      .upload(fileName, buffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: true,
      });

    let fileUrl = '';

    if (uploadError) {
      // Si el bucket no existe o falla, guardar URL de placeholder pero continuar
      console.warn('KYC storage upload warning:', uploadError.message);
      fileUrl = `https://demo.pachanova.io/kyc/${investorId}/${documentType}`;
    } else {
      const { data: urlData } = supabaseAdmin.storage
        .from('kyc-documents')
        .getPublicUrl(fileName);
      fileUrl = urlData.publicUrl;
    }

    // Upsert en kyc_documents
    await supabaseAdmin.from('kyc_documents').upsert(
      {
        investor_id: investorId,
        document_type: documentType.toUpperCase(),
        file_url: fileUrl,
        status: 'pending',
        is_demo: true,
        uploaded_at: new Date().toISOString(),
      },
      { onConflict: 'investor_id,document_type' }
    );

    await supabaseAdmin.from('audit_logs').insert({
      action: 'KYC_DOCUMENT_UPLOADED',
      details: `Investor ${investorId} uploaded ${documentType} document`,
    });

    return NextResponse.json({ success: true, fileUrl, documentType });
  } catch (error) {
    console.error('KYC upload error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
