'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import ClientMap from '@/app/components/ClientMap'

// This should map to your Supabase Property type
export type AdminProperty = {
  id?: number
  title: string
  price: number
  status: string
  type: string
  description: string
  address: string
  image_url: string
  images?: string[]
  area: number // m2
  year_built: number
  beds: number
  baths: number
  parking: number
  amenities: string[]
  latitude?: number | null
  longitude?: number | null
}

const AMENITY_OPTIONS = [
  'Swimming Pool',
  'Garden',
  'Air Conditioning',
  'Smart Home',
  'Gym',
  'Security System'
]

type PropertyFormProps = {
  initialData?: AdminProperty
  onSubmit: (data: FormData) => Promise<{ success: boolean; error?: string }>
}

export function PropertyForm({ initialData, onSubmit }: PropertyFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // States for counters
  const [bedrooms, setBedrooms] = useState(initialData?.beds || 0)
  const [bathrooms, setBathrooms] = useState(initialData?.baths || 0)
  const [parking, setParking] = useState(initialData?.parking || 0)
  
  // State for amenities
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    initialData?.amenities || []
  )

  // State for images preview
  const [existingImages, setExistingImages] = useState<string[]>(
    (initialData?.images && initialData.images.length > 0)
      ? initialData.images
      : (initialData?.image_url ? [initialData.image_url] : [])
  )
  const [previewFiles, setPreviewFiles] = useState<{file: File, preview: string}[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [lat, setLat] = useState<number | null>(initialData?.latitude ?? null)
  const [lng, setLng] = useState<number | null>(initialData?.longitude ?? null)
  const [currentAddress, setCurrentAddress] = useState(initialData?.address || '')

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    )
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      const newPreviews = filesArray.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }))
      setPreviewFiles(prev => [...prev, ...newPreviews])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files)
      const validFiles = filesArray.filter(f => f.type.startsWith('image/'))
      const newPreviews = validFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }))
      setPreviewFiles(prev => [...prev, ...newPreviews])
    }
  }

  const removePreview = (index: number) => {
    setPreviewFiles(prev => {
      const newPreviews = [...prev]
      URL.revokeObjectURL(newPreviews[index].preview) // cleanup
      newPreviews.splice(index, 1)
      return newPreviews
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    
    // Add custom state values that aren't native form inputs
    formData.set('bedrooms', bedrooms.toString())
    formData.set('bathrooms', bathrooms.toString())
    formData.set('parking', parking.toString())
    formData.set('amenities', JSON.stringify(selectedAmenities))
    
    // Append existing images
    existingImages.forEach(url => {
      formData.append('existing_images', url)
    })
    
    // Append new files
    previewFiles.forEach(pf => {
      formData.append('images', pf.file)
    })

    if (initialData?.id) {
      formData.append('id', initialData.id.toString())
    }

    try {
      const result = await onSubmit(formData)
      if (result.success) {
        router.push('/admin')
        router.refresh()
      } else {
        setError(result.error || 'Something went wrong')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save property')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
      {error && (
        <div className="xl:col-span-12 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      {/* Left Column */}
      <div className="xl:col-span-8 space-y-8">
        
        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-[#006655]/10 flex items-center gap-3 bg-gradient-to-r from-[#006655]/5 to-transparent">
            <div className="w-8 h-8 rounded-full bg-[#006655]/10 flex items-center justify-center text-[#19322F]">
              <span className="material-icons text-lg">info</span>
            </div>
            <h2 className="text-xl font-bold text-[#19322F]">Basic Information</h2>
          </div>
          <div className="p-8 space-y-6">
            <div className="group">
              <label htmlFor="title" className="block text-sm font-medium text-[#19322F] mb-1.5 font-sf-pro">
                Property Title <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                id="title" 
                name="title"
                required
                defaultValue={initialData?.title}
                placeholder="e.g. Modern Penthouse with Ocean View" 
                className="w-full text-base px-4 py-2.5 rounded-md border-gray-200 bg-white text-[#19322F] placeholder-gray-400 focus:ring-1 focus:ring-[#006655] focus:border-[#006655] transition-all font-sf-pro"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="price_usd" className="block text-sm font-medium text-[#19322F] mb-1.5 font-sf-pro">
                  Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-sf-pro text-sm">$</span>
                  <input 
                    type="number" 
                    id="price_usd" 
                    name="price_usd"
                    required
                    defaultValue={initialData?.price}
                    placeholder="0.00" 
                    className="w-full pl-7 pr-4 py-2.5 rounded-md border-gray-200 bg-white text-[#19322F] placeholder-gray-400 focus:ring-1 focus:ring-[#006655] focus:border-[#006655] transition-all text-base font-medium font-sf-pro"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-[#19322F] mb-1.5 font-sf-pro">Status</label>
                <select 
                  id="status" 
                  name="status"
                  defaultValue={initialData?.status || 'FOR SALE'}
                  className="w-full px-4 py-2.5 rounded-md border-gray-200 bg-white text-[#19322F] focus:ring-1 focus:ring-[#006655] focus:border-[#006655] transition-all text-base font-sf-pro cursor-pointer"
                >
                  <option value="FOR SALE">For Sale</option>
                  <option value="FOR RENT">For Rent</option>
                  <option value="Exclusive">Exclusive</option>
                  <option value="New Arrival">New Arrival</option>
                </select>
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-[#19322F] mb-1.5 font-sf-pro">Property Type</label>
                <select 
                  id="type" 
                  name="type"
                  defaultValue={initialData?.type || 'house'}
                  className="w-full px-4 py-2.5 rounded-md border-gray-200 bg-white text-[#19322F] focus:ring-1 focus:ring-[#006655] focus:border-[#006655] transition-all text-base font-sf-pro cursor-pointer"
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-[#006655]/10 flex items-center gap-3 bg-gradient-to-r from-[#006655]/5 to-transparent">
            <div className="w-8 h-8 rounded-full bg-[#006655]/10 flex items-center justify-center text-[#19322F]">
              <span className="material-icons text-lg">description</span>
            </div>
            <h2 className="text-xl font-bold text-[#19322F]">Description</h2>
          </div>
          <div className="p-8">
            <textarea 
              id="description" 
              name="description"
              defaultValue={initialData?.description}
              placeholder="Describe the property features, neighborhood, and unique selling points..."
              className="w-full px-4 py-3 rounded-md border-gray-200 bg-white text-[#19322F] placeholder-gray-400 focus:ring-1 focus:ring-[#006655] focus:border-[#006655] transition-all text-base font-sf-pro leading-relaxed resize-y min-h-[200px]"
            />
          </div>
        </div>

        {/* Gallery */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-[#006655]/10 flex justify-between items-center bg-gradient-to-r from-[#006655]/5 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#006655]/10 flex items-center justify-center text-[#19322F]">
                <span className="material-icons text-lg">image</span>
              </div>
              <h2 className="text-xl font-bold text-[#19322F]">Gallery</h2>
            </div>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded font-sf-pro">JPG, PNG, WEBP</span>
          </div>
          <div className="p-8">
            <div 
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer group ${
                isDragging 
                  ? 'border-[#006655] bg-[#006655]/10' 
                  : 'border-gray-300 bg-gray-50/50 hover:bg-[#006655]/5 hover:border-[#006655]/40'
              }`}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                multiple 
                accept="image/jpeg, image/png, image/webp"
                className="hidden" 
                onChange={handleFileSelect}
              />
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-[#006655] group-hover:scale-110 transition-transform duration-300">
                  <span className="material-icons text-2xl">cloud_upload</span>
                </div>
                <div className="space-y-1">
                  <p className="text-base font-medium text-[#19322F] font-sf-pro">Click to upload images</p>
                  <p className="text-xs text-gray-400 font-sf-pro">Max file size 5MB per image</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              {/* Show existing images */}
              {existingImages.map((imgUrl, idx) => (
                <div key={`existing-${idx}`} className="aspect-square rounded-lg overflow-hidden relative group shadow-sm bg-gray-100">
                  <img src={imgUrl} alt={`Current property ${idx}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-[#19322F]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); removeExistingImage(idx); }}
                      className="w-8 h-8 rounded-full bg-white text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
                    >
                      <span className="material-icons text-sm">delete</span>
                    </button>
                  </div>
                  {idx === 0 && <span className="absolute top-2 left-2 bg-[#006655] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm font-sf-pro uppercase tracking-wider">Main</span>}
                  {idx > 0 && <span className="absolute top-2 left-2 bg-gray-800 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm font-sf-pro uppercase tracking-wider">Current</span>}
                </div>
              ))}
              
              {/* Show new previews */}
              {previewFiles.map((pf, idx) => (
                <div key={`new-${idx}`} className="aspect-square rounded-lg overflow-hidden relative group shadow-sm bg-gray-100">
                  <img src={pf.preview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-[#19322F]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); removePreview(idx); }}
                      className="w-8 h-8 rounded-full bg-white text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
                    >
                      <span className="material-icons text-sm">delete</span>
                    </button>
                  </div>
                  {existingImages.length === 0 && idx === 0 && (
                    <span className="absolute top-2 left-2 bg-[#006655] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm font-sf-pro uppercase tracking-wider">Main</span>
                  )}
                  <span className="absolute top-2 right-2 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm font-sf-pro uppercase tracking-wider">New</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="xl:col-span-4 space-y-8">
        {/* Location */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#006655]/10 flex items-center gap-3 bg-gradient-to-r from-[#006655]/5 to-transparent">
            <div className="w-8 h-8 rounded-full bg-[#006655]/10 flex items-center justify-center text-[#19322F]">
              <span className="material-icons text-lg">place</span>
            </div>
            <h2 className="text-lg font-bold text-[#19322F]">Location</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-[#19322F] mb-1.5 font-sf-pro">Address</label>
              <input 
                type="text" 
                id="location" 
                name="location"
                defaultValue={initialData?.address}
                onChange={(e) => setCurrentAddress(e.target.value)}
                placeholder="Street Address, City, Zip" 
                className="w-full px-4 py-2.5 rounded-md border-gray-200 bg-white text-[#19322F] placeholder-gray-400 focus:ring-1 focus:ring-[#006655] focus:border-[#006655] transition-all text-sm font-sf-pro"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="latitude" className="block text-xs text-gray-500 font-medium font-sf-pro mb-1">Latitude</label>
                <input 
                  type="number" 
                  step="any"
                  id="latitude" 
                  name="latitude"
                  defaultValue={initialData?.latitude ?? undefined}
                  onChange={(e) => setLat(e.target.value ? parseFloat(e.target.value) : null)}
                  placeholder="e.g. 25.7617" 
                  className="w-full px-3 py-2 rounded border-gray-200 bg-gray-50 text-[#19322F] focus:bg-white focus:ring-1 focus:ring-[#006655] focus:border-[#006655] transition-all font-sf-pro text-sm"
                />
              </div>
              <div>
                <label htmlFor="longitude" className="block text-xs text-gray-500 font-medium font-sf-pro mb-1">Longitude</label>
                <input 
                  type="number" 
                  step="any"
                  id="longitude" 
                  name="longitude"
                  defaultValue={initialData?.longitude ?? undefined}
                  onChange={(e) => setLng(e.target.value ? parseFloat(e.target.value) : null)}
                  placeholder="e.g. -80.1918" 
                  className="w-full px-3 py-2 rounded border-gray-200 bg-gray-50 text-[#19322F] focus:bg-white focus:ring-1 focus:ring-[#006655] focus:border-[#006655] transition-all font-sf-pro text-sm"
                />
              </div>
            </div>
            
            {/* Map Preview */}
            <div className="relative h-48 w-full rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group">
              <ClientMap 
                key={`${lat}-${lng}`}
                address={currentAddress || 'Property Location'} 
                lat={lat ?? undefined} 
                lng={lng ?? undefined} 
              />
              <div className="absolute top-2 right-2 flex items-center gap-1 z-[1000] pointer-events-none">
                <span className="bg-white/90 text-[#19322F] px-2 py-1 rounded shadow-sm backdrop-blur-sm text-[10px] font-bold font-sf-pro flex items-center gap-1">
                  <span className="material-icons text-[12px] text-[#006655]">map</span> Preview
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-400 font-sf-pro flex items-center gap-1">
              <span className="material-icons text-xs">info</span>
              Coordinates are used to pin the property on the map.
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
          <div className="px-6 py-4 border-b border-[#006655]/10 flex items-center gap-3 bg-gradient-to-r from-[#006655]/5 to-transparent">
            <div className="w-8 h-8 rounded-full bg-[#006655]/10 flex items-center justify-center text-[#19322F]">
              <span className="material-icons text-lg">straighten</span>
            </div>
            <h2 className="text-lg font-bold text-[#19322F]">Details</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label htmlFor="area" className="text-xs text-gray-500 font-medium font-sf-pro mb-1 block">Area (sqft)</label>
                <input 
                  type="number" 
                  id="area" 
                  name="area"
                  defaultValue={initialData?.area}
                  placeholder="0" 
                  className="w-full text-left px-3 py-2 rounded border-gray-200 bg-gray-50 text-[#19322F] focus:bg-white focus:ring-1 focus:ring-[#006655] focus:border-[#006655] transition-all font-sf-pro text-sm"
                />
              </div>
              <div className="group">
                <label htmlFor="year_built" className="text-xs text-gray-500 font-medium font-sf-pro mb-1 block">Year Built</label>
                <input 
                  type="number" 
                  id="year_built" 
                  name="year_built"
                  defaultValue={initialData?.year_built}
                  placeholder="YYYY" 
                  className="w-full text-left px-3 py-2 rounded border-gray-200 bg-gray-50 text-[#19322F] focus:bg-white focus:ring-1 focus:ring-[#006655] focus:border-[#006655] transition-all font-sf-pro text-sm"
                />
              </div>
            </div>

            <hr className="border-gray-100" />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#19322F] font-sf-pro flex items-center gap-2">
                  <span className="material-icons text-gray-400 text-sm">bed</span> Bedrooms
                </label>
                <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                  <button type="button" onClick={() => setBedrooms(Math.max(0, bedrooms - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-100">-</button>
                  <input type="text" readOnly value={bedrooms} className="w-10 text-center border-none bg-transparent text-[#19322F] p-0 focus:ring-0 text-sm font-medium font-sf-pro" />
                  <button type="button" onClick={() => setBedrooms(bedrooms + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-100">+</button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#19322F] font-sf-pro flex items-center gap-2">
                  <span className="material-icons text-gray-400 text-sm">shower</span> Bathrooms
                </label>
                <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                  <button type="button" onClick={() => setBathrooms(Math.max(0, bathrooms - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-100">-</button>
                  <input type="text" readOnly value={bathrooms} className="w-10 text-center border-none bg-transparent text-[#19322F] p-0 focus:ring-0 text-sm font-medium font-sf-pro" />
                  <button type="button" onClick={() => setBathrooms(bathrooms + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-100">+</button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#19322F] font-sf-pro flex items-center gap-2">
                  <span className="material-icons text-gray-400 text-sm">directions_car</span> Parking
                </label>
                <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                  <button type="button" onClick={() => setParking(Math.max(0, parking - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-100">-</button>
                  <input type="text" readOnly value={parking} className="w-10 text-center border-none bg-transparent text-[#19322F] p-0 focus:ring-0 text-sm font-medium font-sf-pro" />
                  <button type="button" onClick={() => setParking(parking + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-100">+</button>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />
            
            <div>
              <h3 className="text-sm font-bold text-[#19322F] mb-3 font-sf-pro uppercase tracking-wider text-xs text-gray-500">Amenities</h3>
              <div className="space-y-2">
                {AMENITY_OPTIONS.map((opt) => (
                  <label key={opt} className="flex items-center gap-2.5 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      onChange={() => handleAmenityToggle(opt)}
                      checked={selectedAmenities.includes(opt)}
                      className="w-4 h-4 text-[#006655] border-gray-300 rounded focus:ring-[#006655]" 
                    />
                    <span className="text-sm text-gray-700 font-sf-pro group-hover:text-[#19322F] transition-colors">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="border-gray-100" />
            
            <div className="pt-2 gap-3 flex flex-col">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-3 rounded-lg bg-[#006655] hover:bg-[#19322F] text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 font-sf-pro text-sm disabled:opacity-70"
              >
                <span className="material-icons text-sm">{isSubmitting ? 'hourglass_empty' : 'save'}</span>
                {isSubmitting ? 'Saving...' : 'Save Property'}
              </button>
              <button 
                type="button" 
                onClick={() => router.push('/admin')}
                className="w-full py-3 rounded-lg border border-gray-300 bg-white text-[#19322F] hover:bg-gray-50 transition-colors font-medium font-sf-pro text-sm"
              >
                Cancel
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </form>
  )
}
