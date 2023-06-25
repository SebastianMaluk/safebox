import { useState, useEffect } from 'react'
import '../App.css'
import { Link } from 'react-router-dom'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../components/ui/table.tsx'

import { Button } from '../components/ui/button.tsx'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../components/ui/dialog.tsx'
import { Input } from '../components/ui/input.tsx'
import { Label } from '../components/ui/label.tsx'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import {
  Form,
  FormControl,
  FormField,
  FormMessage
} from '../components/ui/form.tsx'

import { useRut } from 'react-rut'
import formatRut from '../utils/rutFormat.ts'
import { updateDeviceShadow, getDeviceShadow } from '../utils/iot.ts'

const formSchema = z.object({
  rut: z.string().nonempty({ message: 'RUT is required' }),
  password: z.string().nonempty({ message: 'Password is required' })
})

import { Locker } from '../utils/types'

// const defaultData: Locker[] = [
//   {
//     id: 1,
//     rut: '12.345.678-9',
//     used: false,
//     locked: false
//   },
//   {
//     id: 2,
//     rut: '12.345.678-9',
//     used: false,
//     locked: false
//   },
//   {
//     id: 3,
//     rut: '12.345.678-9',
//     used: false,
//     locked: false
//   }
// ]


function App() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null)

  const [password, setPassword] = useState('')

  const [lockers, setLockers] = useState<Locker[]>()
  const [timestamp, setTimestamp] = useState(0)
  // This function is returned from useEffect and will be called when the component is unmounted
  useEffect(() => {
    async function fetchDeviceShadow() {
      const shadow = await getDeviceShadow()
      setLockers(Object.values(shadow.state.reported.lockers))
      setTimestamp(shadow.state.reported.timestamp)
    }
    const intervalId = setInterval(() => {
      fetchDeviceShadow()
    }, 3000)
      return () => {
        clearInterval(intervalId)
      }

    // fetchDeviceShadow()
  })

  // Calculate the difference between now and the last received timestamp
  const dateNow = Date.now()
  const diffInSeconds = Math.floor((dateNow / 1000 - timestamp))

  // Define the message to show based on the calculated difference
  const statusMessage = diffInSeconds < 5
    ? `Last connection ${diffInSeconds} seconds ago`
    : 'System with connection problems';

  const handleOpen = (locker: Locker) => {
    setIsOpen(true)
    setSelectedLocker(locker)
  }

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rut: '20638450-6',
    }
  })

  // 2. Define a submit handler.
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // No need to use `useRut` here anymore because we're already watching the value in the component.
    console.log('Prevalidation')
    console.log({ formattedValue, password: values.password })
    if (!isValid) {
      form.setError('rut', {
        type: 'validate',
        message: 'RUT must be valid'
      })
      // clear the password
      setPassword('')
      return
    }
    if (!password) {
      form.setError('password', {
        type: 'validate',
        message: 'Password must be generated'
      })
      // clear the password
      setRut('')
      setPassword('')
      return
    }
    if (!selectedLocker) return
    selectedLocker.rut = formattedValue
    selectedLocker.used = true
    selectedLocker.open = false
    setIsOpen(false)
    console.log('Postvalidation')
    console.log({ formattedValue, password: values.password })
  }

  // Get the RUT value from the form.
  const rutValue = form.watch('rut')

  // Use the RUT value in the `useRut` hook.
  // @ts-ignore
  const [{ isValid, formattedValue, rawValue }, setRut] = useRut(rutValue)


  return (
    <>
      <div className="flex items-center justify-center pb-4">
        <h1 className="text-4xl">Admin</h1>
        <Link
          to={'/'}
          className="ml-5 w-fit rounded bg-green-500 p-5 text-white"
        >
          Home
        </Link>
      </div>
      {console.log(lockers)}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-3 p-0 font-extrabold">Number</TableHead>
            <TableHead className="text-center font-extrabold">RUT</TableHead>
            <TableHead className="text-center font-extrabold">Password</TableHead>
            <TableHead className="text-center font-extrabold">Used</TableHead>
            <TableHead className="text-center font-extrabold">Locked</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          
          {lockers ? (
            lockers.map((locker) => (
              <TableRow
                key={locker.id}
                className={
                  locker.lockStatus === 'WAITING'
                    ? 'bg-yellow-400 hover:bg-yellow-300'
                    : locker.lockStatus === 'UNLOCKED'
                      ? 'bg-green-400 hover:bg-green-300'
                      : 'bg-red-400 hover:bg-red-300'
                }
                onClick={() => 
                  locker.lockStatus === 'UNLOCKED' ? handleOpen(locker) : null}
              >
                <TableCell>{locker.id}</TableCell>
                <TableCell>{locker.rut ? formatRut(locker.rut) : 'N/A'}</TableCell>
                <TableCell>{locker.password ? locker.password : 'N/A'}</TableCell>
                <TableCell>{locker.used.toString()}</TableCell>
                <TableCell>{locker.lockStatus}</TableCell>
              </TableRow>
            )))
            : (Array.from({length: 3}).map((_, id) => (
              <TableRow
                key={id + 1}
                className='bg-gray-400 hover:bg-gray-300'
              >
                <TableCell>{id + 1}</TableCell>
                <TableCell>Loading</TableCell>
                <TableCell>Loading</TableCell>
                <TableCell>Loading</TableCell>
                <TableCell>Loading</TableCell>
              </TableRow>
            )))
          }
        </TableBody>
      </Table>
      <div className='pt-5'>
        {statusMessage}
      </div>

      {selectedLocker && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                Save document on locker {selectedLocker.id}
              </DialogTitle>
              <DialogDescription>
                Enter a RUT to generate a password
              </DialogDescription>
            </DialogHeader>
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
                      <div className="grid grid-cols-4 items-center gap-2">
                        <Label htmlFor="rut" className="text-right">
                          RUT
                        </Label>
                        <FormControl className="col-span-3">
                          <Input
                            id="rut"
                            value={formattedValue} // value from useRut
                            onChange={(e) => {
                              if (e.target.value.length > 12) return
                              setRut(e.target.value) // update value in useRut
                              form.clearErrors('rut')
                              field.onChange(e) // update value in react-hook-form
                            }}
                            onBlur={field.onBlur} // blur event from react-hook-form
                          />
                        </FormControl>
                        <FormMessage className="whitespace-nowrap pl-24" />
                      </div>
                    )}
                  />
                  <DialogFooter>
                    <Button
                      type="button"
                      onClick={() => {
                        setPassword('')
                        if (!isValid) {
                          form.setError('rut', {
                            type: 'validate',
                            message: 'RUT must be valid'
                          })
                          return
                        }
                        // Check if there are any lockers with the same RUT
                        if (!lockers) return
                        const existingLockers = lockers.filter(locker => locker.rut === rawValue)
                        let passwordToUse = ''
                        if (existingLockers.length > 0) {
                          // If there is at least one locker with the same RUT, use its password
                          if (!existingLockers[0].password) return
                          passwordToUse = existingLockers[0].password
                        } else {
                          // Otherwise, generate a new password
                          const randomPassword = Math.floor(Math.random() * 10000)
                          passwordToUse = randomPassword.toString()
                        }
                        setPassword(passwordToUse)
                        form.setValue('password', passwordToUse) // update react-hook-form state
                        console.log({ 'Generated password': passwordToUse})
                      }}
                    >
                      Generate
                    </Button>
                  </DialogFooter>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <div className="mt-5 grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">
                          Client Password
                        </Label>
                        <FormControl className="col-span-3">
                          <Input
                            id="password"
                            value={password}
                            readOnly={true}
                            onChange={field.onChange} // bind onChange event
                            onBlur={field.onBlur} // bind onBlur event
                          />
                        </FormControl>
                        <FormMessage className="whitespace-nowrap" />
                      </div>
                    )}
                  />
                  <Button className="mt-3" type="submit">
                    Lock
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default App
