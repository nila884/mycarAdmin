// src/components/car/settings/model/modelForm.tsx

import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import InputError from '@/components/input-error'
import { useForm } from '@inertiajs/react'
import { Pencil } from 'lucide-react'
import React, { useEffect, useState } from 'react'

interface Brand {
  id: number
  brand_name: string
}

interface ModelItem {
  id: number
  model_name: string
  brand_id: number
}

type ModelFormData = {
  model_name: string
  brand_id: number | ''
}

type ModelInertiaForm = ModelFormData & {
  _method?: 'patch'
}

interface Props {
  model?: ModelItem
  brands: Brand[]
}

const ModelForm: React.FC<Props> = ({ model, brands }) => {
  const isUpdate = !!model
  const [open, setOpen] = useState(false)

  const { data, setData, post, processing, errors } =
    useForm<ModelInertiaForm>({
      _method: isUpdate ? 'patch' : undefined,
      model_name: model?.model_name ?? '',
      brand_id: model?.brand_id ?? '',
    })

  useEffect(() => {
    if (open) {
      setData({
        _method: isUpdate ? 'patch' : undefined,
        model_name: model?.model_name ?? '',
        brand_id: model?.brand_id ?? '',
      })
    }
  }, [open])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    post(route(isUpdate ? 'carmodel.update' : 'carmodel.store', model?.id), {
      onSuccess: () => setOpen(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={isUpdate ? 'outline' : 'default'} size={isUpdate ? 'icon' : 'default'}>
          {isUpdate ? <Pencil className="h-4 w-4" /> : 'Add Model'}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isUpdate ? 'Update Model' : 'Create Model'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label>Brand</Label>
            <select
              className="w-full border rounded p-2"
              value={data.brand_id}
              onChange={e => setData('brand_id', Number(e.target.value))}
            >
              <option value="">Select brand</option>
              {brands.map(b => (
                <option key={b.id} value={b.id}>{b.brand_name}</option>
              ))}
            </select>
            <InputError message={errors.brand_id} />
          </div>

          <div>
            <Label>Model Name</Label>
            <Input
              value={data.model_name}
              onChange={e => setData('model_name', e.target.value)}
            />
            <InputError message={errors.model_name} />
          </div>

          <Button disabled={processing} className="w-full">
            {processing ? 'Saving…' : isUpdate ? 'Update' : 'Create'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ModelForm
