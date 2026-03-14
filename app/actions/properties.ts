'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Note: Ensure the bucket "properties" exists and is public

export async function uploadPropertyImages(formData: FormData): Promise<string[]> {
  const supabase = await createClient()
  const images = formData.getAll('images') as File[]
  const uploadedUrls: string[] = []

  for (const file of images) {
    if (file.size === 0) continue

    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
    const filePath = `property_images/${fileName}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('properties')
      .upload(filePath, file)

    if (uploadError) {
      console.error('Upload Error:', uploadError)
      throw new Error(`Failed to upload ${file.name}`)
    }

    if (uploadData) {
      const { data: { publicUrl } } = supabase.storage
        .from('properties')
        .getPublicUrl(filePath)
      
      uploadedUrls.push(publicUrl)
    }
  }

  return uploadedUrls
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function createPropertyAction(formData: FormData) {
  const supabase = await createClient()

  // Authenticate & check admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { data: roleData } = await supabase
    .from('user_roles')
    .select('roles(name)')
    .eq('user_id', user.id)

  const isAdmin = roleData?.some(r => (r.roles as any)?.name === 'admin')
  if (!isAdmin) return { success: false, error: 'Not an admin' }

  try {
    // 1. Upload images first
    const newImageUrls = await uploadPropertyImages(formData)
    
    // For MVP, we'll just save the first image to `image_url`. 
    // Usually you'd have an array or a separate `property_images` table.
    // If no new images and we are creating, there's no main image.
    const mainImageUrl = newImageUrls.length > 0 ? newImageUrls[0] : ''

    // 2. Parse form data
    const title = formData.get('title') as string
    const price_usd = parseFloat(formData.get('price_usd') as string)
    const status = formData.get('status') as string
    const type = formData.get('type') as string
    const location = formData.get('location') as string
    const description = formData.get('description') as string
    
    const areaStr = formData.get('area') as string
    const yearStr = formData.get('year_built') as string
    const area = areaStr ? parseFloat(areaStr) : null
    const year_built = yearStr ? parseInt(yearStr, 10) : null
    
    const bedrooms = parseInt(formData.get('bedrooms') as string, 10) || 0
    const bathrooms = parseInt(formData.get('bathrooms') as string, 10) || 0
    const parking = parseInt(formData.get('parking') as string, 10) || 0
    
    const amenitiesStr = formData.get('amenities') as string
    const amenities = amenitiesStr ? JSON.parse(amenitiesStr) : []

    const latStr = formData.get('latitude') as string
    const lngStr = formData.get('longitude') as string
    const latitude = latStr ? parseFloat(latStr) : null
    const longitude = lngStr ? parseFloat(lngStr) : null

    // 3. Insert into DB
    const { data, error } = await supabase
      .from('properties')
      .insert({
        title,
        price: price_usd,
        status,
        type,
        address: location,
        description,
        area,
        year_built,
        beds: bedrooms,
        baths: bathrooms,
        parking,
        amenities,
        images: newImageUrls,
        image_url: mainImageUrl,
        image_alt: title || 'Property Image',
        id_seo: generateSlug(title) || `property-${Date.now()}`,
        latitude,
        longitude
      })
      .select()
      .single()

    if (error) {
      console.error("DB Insert Error:", error)
      return { success: false, error: error.message }
    }

    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true, data }

  } catch (error: any) {
    console.error("Action Error:", error)
    return { success: false, error: error.message }
  }
}

export async function updatePropertyAction(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const { data: roleData } = await supabase
    .from('user_roles')
    .select('roles(name)')
    .eq('user_id', user.id)

  const isAdmin = roleData?.some(r => (r.roles as any)?.name === 'admin')
  if (!isAdmin) return { success: false, error: 'Not an admin' }

  try {
    const id = formData.get('id') as string
    if (!id) return { success: false, error: 'Property ID missing' }

    // 1. Check if new images were uploaded and combine with existing
    const existingImages = formData.getAll('existing_images') as string[]
    const newImageUrls = await uploadPropertyImages(formData)
    
    const allImages = [...existingImages, ...newImageUrls]
    
    // We only update image_url if a new one was actually uploaded
    const title = formData.get('title') as string
    let updatePayload: any = {
      title,
      price: parseFloat(formData.get('price_usd') as string),
      status: formData.get('status') as string,
      type: formData.get('type') as string,
      address: formData.get('location') as string,
      description: formData.get('description') as string,
      beds: parseInt(formData.get('bedrooms') as string, 10) || 0,
      baths: parseInt(formData.get('bathrooms') as string, 10) || 0,
      parking: parseInt(formData.get('parking') as string, 10) || 0,
    }
    
    if (title) {
        updatePayload.id_seo = generateSlug(title) || `property-${id}`
        updatePayload.image_alt = title
    }

    const areaStr = formData.get('area') as string
    const yearStr = formData.get('year_built') as string
    if (areaStr) updatePayload.area = parseFloat(areaStr)
    if (yearStr) updatePayload.year_built = parseInt(yearStr, 10)

    const amenitiesStr = formData.get('amenities') as string
    if (amenitiesStr) updatePayload.amenities = JSON.parse(amenitiesStr)

    const latStr = formData.get('latitude') as string
    const lngStr = formData.get('longitude') as string
    updatePayload.latitude = latStr ? parseFloat(latStr) : null
    updatePayload.longitude = lngStr ? parseFloat(lngStr) : null

    updatePayload.images = allImages;
    if (allImages.length > 0) {
      updatePayload.image_url = allImages[0]
    } else {
      updatePayload.image_url = ''
    }

    // 2. Update DB
    const { data, error } = await supabase
      .from('properties')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error("DB Update Error:", error)
      return { success: false, error: error.message }
    }

    revalidatePath('/admin')
    revalidatePath('/')
    // We might also need to revalidate `/admin/properties/${id}/edit` etc.
    return { success: true, data }

  } catch (error: any) {
    console.error("Action Error:", error)
    return { success: false, error: error.message }
  }
}

export async function getPropertyById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()
    
  if (error) {
    console.error("Fetch Property Error:", error)
    return null
  }
  return data
}
