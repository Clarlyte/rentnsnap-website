import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('rental-documents')
      .upload(`${Date.now()}-${file.name}`, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      throw uploadError
    }

    // Get the public URL for the uploaded file
    const { data } = supabase
      .storage
      .from('rental-documents')
      .getPublicUrl(uploadData.path)

    return NextResponse.json({ 
      url: data.publicUrl,
      path: uploadData.path,
      message: 'File uploaded successfully' 
    })

  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload file' },
      { status: 500 }
    )
  }
} 