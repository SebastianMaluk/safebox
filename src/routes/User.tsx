import '../App.css'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { Button } from '../components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../components/ui/form'
import { Input } from '../components/ui/input'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../components/ui/dialog'
import { Label } from '../components/ui/label'

import { Camera } from 'lucide-react'
import Scanner from '../components/scanner'
import { useRut } from 'react-rut'
import { Locker } from '../utils/types'
import { getDeviceShadow, updateDeviceShadow } from '../utils/iot'

const formSchema = z.object({
  rut: z.string(),
  password: z.string()
})

export function ProfileForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [rutValue, setRutValue] = useState('')
  // @ts-ignore
  const [{ isValid, formattedValue, rawValue }, setRut] = useRut(rutValue)

  const [lockers, setLockers] = useState<Locker[]>()
  useEffect(() => {
    async function fetchDeviceShadow() {
      const shadow = await getDeviceShadow()
      setLockers(Object.values(shadow.state.reported.lockers))
    }
    fetchDeviceShadow() 
  })

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rut: '',
      password: ''
    }
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log({ formattedValue, password: values.password })
    // Find all lockers associated with the entered RUT
    if (!lockers) return
    const assignedLockers = lockers.filter(locker => locker.rut === rawValue)
    console.log({ rawValue })
    console.log({ lockers })
    console.log({ assignedLockers })
    if (assignedLockers.length === 0) {
      form.setError('rut', {
        type: 'validate',
        message: 'RUT not found'
      })
      return
    }

    for (let locker of assignedLockers) {
      locker.lockStatus = 'UNLOCKED'
      locker.rut = ''
      locker.password = ''
      await updateDeviceShadow(locker)
    }

    const shadow = await getDeviceShadow()
    setLockers(Object.values(shadow.state.reported.lockers))
  }

  return (
    <>
      <div className="flex items-center justify-center pb-4">
        <h1 className="text-4xl">User</h1>
        <Link
          to={'/'}
          className="ml-5 w-fit rounded bg-green-500 p-5 text-white"
        >
          Home
        </Link>
      </div>
      <div className="flex items-center justify-center pb-4">
        <div className="flex w-full max-w-xs items-center justify-center">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md"
            >
              <FormField
                control={form.control}
                name="rut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-left text-sm font-bold text-gray-700">
                      RUT
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                        value={formattedValue} // value from useRut
                        onChange={(e) => {
                          if (e.target.value.length > 12) return
                          setRut(e.target.value) // update value in useRut
                          field.onChange(e) // update value in react-hook-form
                        }}
                        onBlur={field.onBlur} // blur event from react-hook-form
                      />
                    </FormControl>
                    <Button
                      className="bg-gray-600"
                      onClick={(event) => {
                        event.preventDefault()
                        setRut('')
                        setIsOpen(true)
                      }}
                    >
                      Open Scanner
                      <Camera
                        className="stroke-primary-foreground pl-2"
                        size={30}
                      />
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mt-3 block text-left text-sm font-bold text-gray-700">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="mt-3" type="submit">
                Unlock
              </Button>
            </form>
          </Form>
        </div>
      </div>
      {
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Scan the QR code from your ID card</DialogTitle>
            </DialogHeader>
            <Scanner setRut={setRut} setOpen={setIsOpen}></Scanner>
          </DialogContent>
        </Dialog>
      }
    </>
  )
}

export default ProfileForm
