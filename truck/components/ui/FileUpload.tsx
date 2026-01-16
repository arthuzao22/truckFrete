"use client"

import { useState, useRef, DragEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, FileImage, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/Button"
import Image from "next/image"

interface UploadedFile {
  id: string
  file: File
  preview: string
  url?: string
  uploading: boolean
  error?: string
}

interface FileUploadProps {
  maxFiles?: number
  maxSize?: number // em bytes
  accept?: string
  multiple?: boolean
  onFilesChange?: (files: UploadedFile[]) => void
  autoUpload?: boolean
  className?: string
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

export function FileUpload({
  maxFiles = 5,
  maxSize = MAX_FILE_SIZE,
  accept = "image/*",
  multiple = true,
  onFilesChange,
  autoUpload = true,
  className = "",
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return

    const newFiles: UploadedFile[] = []
    const newErrors: string[] = []

    // Validar e processar arquivos
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]

      // Verificar limite de arquivos
      if (files.length + newFiles.length >= maxFiles) {
        break
      }

      // Validar tipo
      if (!ACCEPTED_TYPES.includes(file.type)) {
        newErrors.push(`Arquivo ${file.name} não é uma imagem válida`)
        continue
      }

      // Validar tamanho
      if (file.size > maxSize) {
        newErrors.push(`Arquivo ${file.name} excede o tamanho máximo de ${maxSize / 1024 / 1024}MB`)
        continue
      }

      // Criar preview
      const preview = URL.createObjectURL(file)

      newFiles.push({
        id: `${Date.now()}-${i}`,
        file,
        preview,
        uploading: false,
      })
    }

    setErrors(newErrors)
    const updatedFiles = [...files, ...newFiles]
    setFiles(updatedFiles)

    // Auto upload se habilitado
    if (autoUpload) {
      for (const fileData of newFiles) {
        await uploadFile(fileData.id, updatedFiles)
      }
    } else {
      onFilesChange?.(updatedFiles)
    }
  }

  const uploadFile = async (fileId: string, currentFiles: UploadedFile[]) => {
    const fileIndex = currentFiles.findIndex((f) => f.id === fileId)
    if (fileIndex === -1) return

    const fileData = currentFiles[fileIndex]

    // Marcar como uploading
    const updatingFiles = [...currentFiles]
    updatingFiles[fileIndex] = { ...fileData, uploading: true }
    setFiles(updatingFiles)

    try {
      // Converter para base64
      const base64 = await fileToBase64(fileData.file)

      // Enviar para API
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file: base64,
          filename: fileData.file.name,
          mimetype: fileData.file.type,
          size: fileData.file.size,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Erro ao fazer upload")
      }

      const { url } = await res.json()

      // Atualizar com URL
      const successFiles = [...updatingFiles]
      successFiles[fileIndex] = { ...fileData, url, uploading: false }
      setFiles(successFiles)
      onFilesChange?.(successFiles)
    } catch (error) {
      const errorFiles = [...updatingFiles]
      errorFiles[fileIndex] = {
        ...fileData,
        uploading: false,
        error: error instanceof Error ? error.message : "Erro ao fazer upload",
      }
      setFiles(errorFiles)
      onFilesChange?.(errorFiles)
    }
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const removeFile = (fileId: string) => {
    const fileToRemove = files.find((f) => f.id === fileId)
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.preview)
    }

    const updatedFiles = files.filter((f) => f.id !== fileId)
    setFiles(updatedFiles)
    onFilesChange?.(updatedFiles)
  }

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFiles = e.dataTransfer.files
    handleFiles(droppedFiles)
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }

  return (
    <div className={className}>
      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          {errors.map((error, i) => (
            <p key={i} className="text-sm text-red-600">{error}</p>
          ))}
        </div>
      )}

      {/* Drop Zone */}
      <motion.div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
        className={`
          relative border-2 border-dashed rounded-xl p-8 cursor-pointer
          transition-all duration-200
          ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400 bg-gray-50"
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center text-center">
          <Upload
            className={`w-12 h-12 mb-4 ${isDragging ? "text-blue-500" : "text-gray-400"}`}
          />
          <p className="text-lg font-medium text-gray-900 mb-2">
            {isDragging ? "Solte os arquivos aqui" : "Arraste imagens ou clique para selecionar"}
          </p>
          <p className="text-sm text-gray-500">
            Máximo {maxFiles} arquivo{maxFiles > 1 ? "s" : ""} · PNG, JPG, WEBP até{" "}
            {maxSize / 1024 / 1024}MB
          </p>
        </div>
      </motion.div>

      {/* Preview Grid */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          <AnimatePresence>
            {files.map((fileData) => (
              <motion.div
                key={fileData.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100"
              >
                {/* Image Preview */}
                <Image
                  src={fileData.preview}
                  alt={fileData.file.name}
                  fill
                  className="object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeFile(fileData.id)}
                    disabled={fileData.uploading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Loading */}
                {fileData.uploading && (
                  <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  </div>
                )}

                {/* Error */}
                {fileData.error && (
                  <div className="absolute inset-0 bg-red-50/90 flex flex-col items-center justify-center p-2">
                    <AlertCircle className="w-6 h-6 text-red-600 mb-1" />
                    <p className="text-xs text-red-600 text-center">{fileData.error}</p>
                  </div>
                )}

                {/* Success Badge */}
                {fileData.url && !fileData.uploading && !fileData.error && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    ✓
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
