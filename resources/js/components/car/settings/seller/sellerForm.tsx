// sellerForm.tsx
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import InputError from '@/components/input-error'
import { useForm } from '@inertiajs/react'
import { Pencil } from 'lucide-react'
import { useEffect, useState } from 'react'

type Seller = {
  id?: number
  seller_name: string
  phone: string
  email: string
  address: string
  country: string
}

type SellerFormData = Seller & { _method?: 'patch' }

export default function SellerForm({ seller }: { seller?: Seller }) {
  const isUpdate = !!seller
  const [open, setOpen] = useState(false)

  const { data, setData, post, processing, errors } = useForm<SellerFormData>({
    seller_name: seller?.seller_name ?? '',
    phone: seller?.phone ?? '',
    email: seller?.email ?? '',
    address: seller?.address ?? '',
    country: seller?.country ?? '',
    _method: isUpdate ? 'patch' : undefined,
  })

  useEffect(() => {
    if (open && seller) {
      setData({ ...seller, _method: 'patch' })
    }
  }, [open])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    post(
      isUpdate
        ? route('carseller.update', seller!.id)
        : route('carseller.store'),
      { onSuccess: () => setOpen(false) }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={isUpdate ? 'outline' : 'default'} size={isUpdate ? 'icon' : 'default'}>
          {isUpdate ? <Pencil className="h-4 w-4" /> : 'Add Seller'}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isUpdate ? 'Update Seller' : 'Create Seller'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-3">
          {['seller_name', 'email', 'phone', 'address', 'country'].map(field => (
            <div key={field}>
              <Label>{field.replace('_', ' ')}</Label>
              <Input
                value={(data as any)[field]}
                onChange={e => setData(field as any, e.target.value)}
              />
              <InputError message={(errors as any)[field]} />
            </div>
          ))}

          <Button disabled={processing} className="w-full">
            {processing ? 'Saving…' : isUpdate ? 'Update' : 'Create'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
