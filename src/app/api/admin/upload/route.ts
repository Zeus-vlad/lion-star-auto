import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

// Neon storage constants
const NEON_API = 'https://console.neon.tech/api/v2';
const PROJECT_ID = process.env.NEON_PROJECT_ID || 'quiet-dust-96557747';
const BRANCH_ID = process.env.NEON_BRANCH_ID || 'br-royal-dust-ay28petz';
const BUCKET = 'lstar-images';
const CDN = 'https://br-royal-dust-ay28petz.storage.c-5.us-east-2.aws.neon.tech/lstar-images';

const MAX_SIZE = 15 * 1024 * 1024; // 15 MB

function getApiKey() {
  const key = process.env.NEON_API_KEY;
  if (!key) throw new Error('NEON_API_KEY not configured');
  return key;
}

async function presignUpload(objectKey: string, contentType: string) {
  const encodedKey = encodeURIComponent(objectKey).replace(/%2F/g, '%2F');
  const res = await fetch(
    `${NEON_API}/projects/${PROJECT_ID}/branches/${BRANCH_ID}/buckets/${BUCKET}/objects/${encodedKey}/presign`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getApiKey()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ operation: 'upload', content_type: contentType, expires_in_seconds: 900 }),
    }
  );
  if (!res.ok) throw new Error(`Presign failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data as { url: string; method: string; headers: Record<string, string> };
}

export async function POST(request: NextRequest) {
  // 1. Admin gate
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    // 2. Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'cars';

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    // 3. Validate size (max 15MB)
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `Image too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max is 15MB.` },
        { status: 413 }
      );
    }

    // 4. Validate type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // 5. Build object key: folder/timestamp-slug.ext
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
    const slug = file.name
      .replace(/\.[^.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'image';
    const objectKey = `${folder}/${Date.now()}-${slug}.${ext}`;

    // 6. Presign upload URL
    const presigned = await presignUpload(objectKey, file.type);

    // 7. Upload bytes to the presigned URL
    const bytes = Buffer.from(await file.arrayBuffer());
    const uploadRes = await fetch(presigned.url, {
      method: presigned.method as 'PUT',
      headers: { ...presigned.headers, 'Content-Type': file.type },
      body: bytes,
    });
    if (!uploadRes.ok) {
      throw new Error(`Upload failed: ${uploadRes.status} ${await uploadRes.text()}`);
    }

    // 8. Return the public CDN URL
    return NextResponse.json({
      url: `${CDN}/${objectKey}`,
      objectKey,
      size: file.size,
    });
  } catch (e) {
    console.error('Upload error:', e);
    return NextResponse.json({ error: (e as Error).message || 'Upload failed' }, { status: 500 });
  }
}

// DELETE /api/admin/upload?key=cars/xxx.jpg — delete an object from the bucket
export async function DELETE(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const objectKey = searchParams.get('key');
    if (!objectKey) return NextResponse.json({ error: 'key is required' }, { status: 400 });

    // Only allow deleting within our bucket prefixes
    if (!/^(cars|brand|wheels|colors|views|luxury|site)\//.test(objectKey)) {
      return NextResponse.json({ error: 'Invalid object key' }, { status: 400 });
    }

    const encodedKey = encodeURIComponent(objectKey);
    const res = await fetch(
      `${NEON_API}/projects/${PROJECT_ID}/branches/${BRANCH_ID}/buckets/${BUCKET}/objects/${encodedKey}`,
      { method: 'DELETE', headers: { Authorization: `Bearer ${getApiKey()}` } }
    );
    if (!res.ok) {
      throw new Error(`Delete failed: ${res.status} ${await res.text()}`);
    }
    return NextResponse.json({ deleted: objectKey });
  } catch (e) {
    console.error('Delete error:', e);
    return NextResponse.json({ error: (e as Error).message || 'Delete failed' }, { status: 500 });
  }
}
