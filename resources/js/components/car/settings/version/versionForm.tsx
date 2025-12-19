// src/components/car/settings/version/versionForm.tsx

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

interface Model {
  id: number
  model_name: string
}

interface VersionItem {
  id: number
  version_name: string
  version_year: string
  car_model_id: number
}

type VersionFormData = {
  version_name: string
  version_year: string
  car_model_id: number | ''
}

type VersionInertiaForm = VersionFormData & {
  _method?: 'patch'
}

interface Props {
  version?: VersionItem
  models: Model[]
}

const VersionForm: React.FC<Props> = ({ version, models }) => {
  const isUpdate = !!version
  const [open, setOpen] = useState(false)

  const { data, setData, post, processing, errors } =
    useForm<VersionInertiaForm>({
      _method: isUpdate ? 'patch' : undefined,
      version_name: version?.version_name ?? '',
      version_year: version?.version_year ?? '',
      car_model_id: version?.car_model_id ?? '',
    })

  useEffect(() => {
    if (open) {
      setData({
        _method: isUpdate ? 'patch' : undefined,
        version_name: version?.version_name ?? '',
        version_year: version?.version_year ?? '',
        car_model_id: version?.car_model_id ?? '',
      })
    }
  }, [open])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    post(route(isUpdate ? 'carversion.update' : 'carversion.store', version?.id), {
      onSuccess: () => setOpen(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={isUpdate ? 'outline' : 'default'} size={isUpdate ? 'icon' : 'default'}>
          {isUpdate ? <Pencil className="h-4 w-4" /> : 'Add Version'}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isUpdate ? 'Update Version' : 'Create Version'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label>Model</Label>
            <select
              className="w-full border rounded p-2"
              value={data.car_model_id}
              onChange={e => setData('car_model_id', Number(e.target.value))}
            >
              <option value="">Select model</option>
              {models.map(m => (
                <option key={m.id} value={m.id}>{m.model_name}</option>
              ))}
            </select>
            <InputError message={errors.car_model_id} />
          </div>

          <div>
            <Label>Version Name</Label>
            <Input
              value={data.version_name}
              onChange={e => setData('version_name', e.target.value)}
            />
            <InputError message={errors.version_name} />
          </div>

          <div>
            <Label>Year</Label>
            <Input
              value={data.version_year}
              onChange={e => setData('version_year', e.target.value)}
            />
            <InputError message={errors.version_year} />
          </div>

          <Button disabled={processing} className="w-full">
            {processing ? 'Saving…' : isUpdate ? 'Update' : 'Create'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default VersionForm
