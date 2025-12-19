// src/components/car/settings/brand/brandForm.tsx

import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import InputError from '@/components/input-error'
import { useForm } from '@inertiajs/react'
import { ImagePlus, Pencil, XCircle } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'

export interface BrandItem {
  id: number
  brand_name: string
  logo?: string
}

type BrandFormData = {
  brand_name: string
  logo: File | null
}

type BrandInertiaForm = BrandFormData & {
  _method?: 'patch'
}

interface Props {
  brand?: BrandItem
}

const BrandForm: React.FC<Props> = ({ brand }) => {
  const isUpdate = !!brand
  const [open, setOpen] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const { data, setData, post, processing, errors } =
    useForm<BrandInertiaForm>({
      _method: isUpdate ? 'patch' : undefined,
      brand_name: brand?.brand_name ?? '',
      logo: null,
    })

  useEffect(() => {
    if (open) {
      setData({
        _method: isUpdate ? 'patch' : undefined,
        brand_name: brand?.brand_name ?? '',
        logo: null,
      })
      setPreview(brand?.logo ?? null)
    }
  }, [open])

  const onDrop = (files: File[]) => {
    const file = files[0]
    setPreview(URL.createObjectURL(file))
    setData('logo', file)
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: { 'image/*': [] },
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    post(
      route(isUpdate ? 'carbrand.update' : 'carbrand.store', brand?.id),
      { forceFormData: true, onSuccess: () => setOpen(false) }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={isUpdate ? 'outline' : 'default'} size={isUpdate ? 'icon' : 'default'}>
          {isUpdate ? <Pencil className="h-4 w-4" /> : 'Add Brand'}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isUpdate ? 'Update Brand' : 'Create Brand'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label>Brand Name</Label>
            <Input
              value={data.brand_name}
              onChange={e => setData('brand_name', e.target.value)}
            />
            <InputError message={errors.brand_name} />
          </div>

          <div {...getRootProps()} className="border p-4 rounded cursor-pointer text-center">
            <input {...getInputProps()} />
            {preview ? <img src={preview} className="h-24 mx-auto" /> : <ImagePlus />}
          </div>

          <Button disabled={processing} className="w-full">
            {processing ? 'Saving…' : isUpdate ? 'Update' : 'Create'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default BrandForm
