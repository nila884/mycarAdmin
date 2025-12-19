// fuelForm.tsx
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import InputError from '@/components/input-error'
import { useForm } from '@inertiajs/react'
import { Pencil } from 'lucide-react'
import { useEffect, useState } from 'react'

type Fuel = { id: number; fuel_type: string }

type FuelFormData = {
  fuel_type: string
  _method?: 'patch'
}

export default function FuelForm({ fuel }: { fuel?: Fuel }) {
  const isUpdate = !!fuel
  const [open, setOpen] = useState(false)

  const { data, setData, post, processing, errors } = useForm<FuelFormData>({
    fuel_type: fuel?.fuel_type ?? '',
    _method: isUpdate ? 'patch' : undefined,
  })

  useEffect(() => {
    if (open) {
      setData({
        fuel_type: fuel?.fuel_type ?? '',
        _method: isUpdate ? 'patch' : undefined,
      })
    }
  }, [open])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    post(
      isUpdate ? route('carfuel.update', fuel!.id) : route('carfuel.store'),
      { onSuccess: () => setOpen(false) }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={isUpdate ? 'outline' : 'default'} size={isUpdate ? 'icon' : 'default'}>
          {isUpdate ? <Pencil className="h-4 w-4" /> : 'Add Fuel'}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isUpdate ? 'Update Fuel' : 'Create Fuel'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label>Fuel Type</Label>
            <Input value={data.fuel_type} onChange={e => setData('fuel_type', e.target.value)} />
            <InputError message={errors.fuel_type} />
          </div>

          <Button disabled={processing} className="w-full">
            {processing ? 'Saving…' : isUpdate ? 'Update' : 'Create'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
