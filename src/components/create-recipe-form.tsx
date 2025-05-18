"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Coffee, ImageIcon, Loader2, Upload, X, LinkIcon } from "lucide-react"
import { useWalletClient } from "@thalalabs/surf/hooks"
import { SECRET_SIPS_ABI } from "@/utils/secret_sips_abi"
import { aptosClient } from "@/utils/aptosClient"
import Image from 'next/image'

export function CreateRecipeForm() {
  const router = useRouter()
  const { client } = useWalletClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
  })
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const [imageUrlInput, setImageUrlInput] = useState("")
  const [showUrlInput, setShowUrlInput] = useState(false)

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Upload image to server
  const uploadImage = async (file: File) => {
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })

      const responseText = await response.text()
      let data

      try {
        data = JSON.parse(responseText)
        
        if (!response.ok) {
          throw new Error(data.error || data.details || 'Failed to upload image')
        }
      } catch (parseError) {
        console.error('Error parsing response:', responseText)
        throw new Error(`Invalid response from server: ${!responseText ? 'Empty response' : 'Invalid JSON'}`)
      }

      setFormData((prev) => ({ ...prev, imageUrl: data.url }))
      toast({
        title: "Image uploaded successfully!",
        description: "Your image has been uploaded and will be shared with your recipe",
      })
    } catch (error) {
      console.error('Error uploading image:', error)
      toast({
        title: "Failed to upload image",
        description: typeof error === 'object' && error !== null ? (error as Error).message : "Please try again or use a different image",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      })
      return
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    const imageUrl = URL.createObjectURL(file)
    setPreviewImage(imageUrl)
    await uploadImage(file)
  }

  // Handle URL input
  const handleImageUrl = () => {
    if (!imageUrlInput) {
      toast({
        title: "Missing URL",
        description: "Please enter an image URL",
        variant: "destructive",
      })
      return
    }

    try {
      new URL(imageUrlInput)
      setPreviewImage(imageUrlInput)
      setFormData((prev) => ({ ...prev, imageUrl: imageUrlInput }))
      setShowUrlInput(false)
      setImageUrlInput("")
    } catch (e) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid image URL",
        variant: "destructive",
      })
    }
  }

  // Clear image
  const clearImage = () => {
    setPreviewImage(null)
    setFormData((prev) => ({ ...prev, imageUrl: "" }))
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!client || !formData.title || !formData.content) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const committedTransaction = await client.useABI(SECRET_SIPS_ABI).create_post({
        type_arguments: [],
        arguments: [formData.title, formData.content, formData.imageUrl || ""],
      })
      
      await aptosClient().waitForTransaction({
        transactionHash: committedTransaction.hash,
      })
      
      toast({
        title: "Recipe shared successfully!",
        description: "Your recipe has been published and is now visible to the community",
      })
      
      router.push("/recipes")
    } catch (error) {
      console.error("Failed to create recipe:", error)
      toast({
        title: "Failed to share recipe",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Setup drag and drop
  useEffect(() => {
    const dropZone = dropZoneRef.current
    if (!dropZone) return

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
      dropZone.classList.add('border-green-600')
    }

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault()
      dropZone.classList.remove('border-green-600')
    }

    const handleDrop = async (e: DragEvent) => {
      e.preventDefault()
      dropZone.classList.remove('border-green-600')
      
      if (!e.dataTransfer?.files.length) return
      
      const file = e.dataTransfer.files[0]
      
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          variant: "destructive",
        })
        return
      }

      const imageUrl = URL.createObjectURL(file)
      setPreviewImage(imageUrl)
      await uploadImage(file)
    }

    dropZone.addEventListener('dragover', handleDragOver)
    dropZone.addEventListener('dragleave', handleDragLeave)
    dropZone.addEventListener('drop', handleDrop)

    return () => {
      dropZone.removeEventListener('dragover', handleDragOver)
      dropZone.removeEventListener('dragleave', handleDragLeave)
      dropZone.removeEventListener('drop', handleDrop)
    }
  }, [])

  return (
    <Card className="border-none shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white py-6 px-8">
        <div className="flex items-center gap-3">
          <Coffee className="h-6 w-6" />
          <h2 className="text-2xl font-bold font-display">Share Your Secret Recipe</h2>
        </div>
        <p className="text-green-100 mt-2 max-w-2xl">
          Share your secret Starbucks recipe with the community and get recognized when others upvote your creation.
        </p>
      </div>

      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recipe Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base">Recipe Title *</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Caramel Cookie Crumble Frappuccino"
              value={formData.title}
              onChange={handleChange}
              required
              className="rounded-lg p-3 text-base"
            />
          </div>

          {/* Recipe Instructions */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-base">Recipe Instructions *</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Share the detailed steps and ingredients for your secret recipe..."
              value={formData.content}
              onChange={handleChange}
              rows={8}
              required
              className="rounded-lg p-3 text-base"
            />
          </div>

          {/* Recipe Image */}
          <div className="space-y-2">
            <Label className="text-base">Recipe Image</Label>
            
            {showUrlInput ? (
              // URL Input
              <div className="flex flex-col space-y-2">
                <div className="flex space-x-2">
                  <Input
                    type="url"
                    placeholder="Enter image URL..."
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    onClick={handleImageUrl}
                    className="bg-green-600 hover:bg-green-700 rounded-md"
                  >
                    Add
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowUrlInput(false)}
                    className="border-green-600 text-green-700"
                  >
                    Cancel
                  </Button>
                </div>
                <p className="text-xs text-gray-500">Make sure the URL directly links to an image file (jpg, png, etc.)</p>
              </div>
            ) : previewImage ? (
              // Image Preview
              <div className="relative mt-2 rounded-lg overflow-hidden border border-gray-200">
                <Image
                  width={500}
                  height={300}
                  src={previewImage} 
                  alt="Preview" 
                  className="w-full h-64 object-cover" 
                />
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-white text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                      <p>Uploading image...</p>
                    </div>
                  </div>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full"
                  onClick={clearImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              // Drop Zone
              <div
                ref={dropZoneRef}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center">
                  <div className="p-3 bg-green-50 rounded-full mb-2">
                    <ImageIcon className="h-6 w-6 text-green-600" />
                  </div>                  <p className="text-gray-700 font-medium mb-1">
                    Drop your image here, or click to browse
                  </p>
                  <p className="text-gray-500 text-sm mb-4">
                    JPG, PNG or GIF (max. 5MB)
                  </p>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full border-green-600 text-green-700"
                      onClick={(e) => {
                        e.stopPropagation()
                        fileInputRef.current?.click()
                      }}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full border-green-600 text-green-700"
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowUrlInput(true)
                      }}
                    >
                      <LinkIcon className="mr-2 h-4 w-4" />
                      Use URL
                    </Button>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="rounded-full px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 rounded-full px-8"
              disabled={isSubmitting || !client}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Share Recipe"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
