import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import InputError from '@/components/input-error'
import { useForm } from '@inertiajs/react'
import { ImagePlus, XCircle, Pencil } from 'lucide-react'
import React, { useEffect, useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

/* ================= TYPES ================= */

type FeatureFormData = {
  feature_name: string
  description: string
  is_main: boolean
  icon: File | null
}

type FeatureInertiaForm = FeatureFormData & {
  _method?: 'patch'
}

interface FeatureItem {
  id: number
  feature_name: string
  description: string
  is_main: boolean
  icon_url?: string
}

interface FeatureFormProps {
  feature?: FeatureItem
}

/* ================= COMPONENT ================= */

const FeatureForm: React.FC<FeatureFormProps> = ({ feature }) => {
  const isUpdate = !!feature
  const title = isUpdate ? `Update ${feature?.feature_name}` : 'Create Feature'
  const routeName = isUpdate ? 'carfeature.update' : 'carfeature.store'
  const submitText = isUpdate ? 'Update Feature' : 'Create Feature'

  const [open, setOpen] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const { data, setData, post, processing, errors, reset } =
    useForm<FeatureInertiaForm>({
      _method: isUpdate ? 'patch' : undefined,
      feature_name: isUpdate ? feature!.feature_name : '',
      description: isUpdate ? feature!.description : '',
      is_main: isUpdate ? feature!.is_main : false,
      icon: null,
    })

  /* ---------- RESET WHEN DIALOG OPENS ---------- */
  useEffect(() => {
    if (!open) return

    setData({
      _method: isUpdate ? 'patch' : undefined,
      feature_name: isUpdate ? feature!.feature_name : '',
      description: isUpdate ? feature!.description : '',
      is_main: isUpdate ? feature!.is_main : false,
      icon: null,
    })

    setPreview(feature?.icon_url ?? null)
  }, [open, isUpdate, feature, setData])

  /* ---------- DROPZONE ---------- */
  const onDrop = useCallback((files: File[]) => {
    if (!files.length) return
    const file = files[0]

    setData('icon', file)

    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)
  }, [setData])

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    maxSize: 1_000_000,
    accept: { 'image/*': [] },
    onDrop,
  })

  /* ---------- SUBMIT ---------- */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const params = isUpdate ? [feature!.id] : []

    post(route(routeName, ...params), {
      forceFormData: true,
      onSuccess: () => {
        setOpen(false)
        reset()
        setPreview(null)
      },
    })
  }

  /* ================= JSX ================= */

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={isUpdate ? 'outline' : 'default'} size={isUpdate ? 'icon' : 'default'}>
          {isUpdate ? <Pencil className="h-4 w-4" /> : 'Add Feature'}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Feature name */}
          <div>
            <Label>Feature name</Label>
            <Input
              value={data.feature_name}
              onChange={e => setData('feature_name', e.target.value)}
            />
            <InputError message={errors.feature_name} />
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Textarea
              rows={3}
              value={data.description}
              onChange={e => setData('description', e.target.value)}
            />
            <InputError message={errors.description} />
          </div>

          {/* Is main */}
          <div className="flex items-center justify-between border rounded-lg p-3">
            <Label>Main feature</Label>
            <Switch
              checked={data.is_main}
              onCheckedChange={v => setData('is_main', v)}
            />
          </div>

          {/* Icon */}
          <div>
            <Label>Icon</Label>
            <div
              {...getRootProps()}
              className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer"
            >
              <input {...getInputProps()} />
              {preview ? (
                <div className="relative">
                  <img src={preview} className="max-h-40 mx-auto" />
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setPreview(null)
                      setData('icon', null)
                    }}
                  >
                    <XCircle />
                  </Button>
                </div>
              ) : (
                <ImagePlus className="mx-auto h-12 w-12 text-muted-foreground" />
              )}
            </div>
            <InputError message={errors.icon} />
          </div>

          <Button type="submit" disabled={processing} className="w-full">
            {processing ? 'Submitting…' : submitText}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default FeatureForm
