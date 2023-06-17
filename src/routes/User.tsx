import '../App.css'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { Button } from '../components/shadcn/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../components/shadcn/form'
import { Input } from '../components/shadcn/input'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../components/shadcn/dialog'
import { Label } from '../components/shadcn/label'

import { Camera } from 'lucide-react'
import Scanner from '../components/shadcn/scanner'
import { useRut } from 'react-rut'

const formSchema = z.object({
  rut: z.string(),
  password: z.string()
})

export function ProfileForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [rutValue, setRutValue] = useState('')
  const [{ isValid, formattedValue, rawValue }, setRut] = useRut(rutValue)
  
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rut: '',
      password: ''
    }
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log({formattedValue, password: values.password})
    
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
            <Scanner setRut={setRut}></Scanner>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2"
              >
                <div className="grid gap-2 py-2">
                  <FormField
                    control={form.control}
                    name="rut"
                    render={({ field }) => (
                      <div className="flex items-center justify-center gap-2">
                        <Label htmlFor="rut" className="text-right">
                          RUT
                        </Label>
                        <Input
                          id="rut"
                          disabled
                          value={formattedValue} // value from useRut
                          onChange={(e) => {
                            console.log(e.target.value)
                            field.onChange(e) // update value in react-hook-form
                          }}
                          onBlur={field.onBlur} // blur event from react-hook-form
                        />
                      </div>
                    )}
                  />
                  <DialogFooter>
                    <Button
                      type="submit"
                      onClick={(event) => {
                        event.preventDefault()
                        setRutValue(formattedValue)
                        setIsOpen(false)
                      }}
                    >
                      Use
                    </Button>
                  </DialogFooter>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      }
    </>
  )
}

export default ProfileForm
