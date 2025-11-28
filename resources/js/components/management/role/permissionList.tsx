import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { PermissionItem } from '@/pages/management/permission/permission'

import React, { useState } from 'react'


interface PermissionProp{
    permissions: PermissionItem[];
}
const PermissionList = ({permissions}:PermissionProp) => {
    const [open, setOpen] = useState(false);
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">permissions</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Permissions</DialogTitle>
          <DialogDescription>
            Permissions List.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
            {permissions.map((permission)=>
               <Badge key={permission.id} variant="secondary">{permission.name}</Badge>
            )}
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </div>
  )
}

export default PermissionList
