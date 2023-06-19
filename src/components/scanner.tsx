import { BarcodeScanner } from './zxing-scanner.tsx'

export interface Props {
  setRut: (rut: string) => void
  setOpen: (open: boolean) => void
}

const Scanner = (props: Props) => {
  return (
    <>
      <div className="flex items-center justify-center">
        <BarcodeScanner setRut={props.setRut} setOpen={props.setOpen} />
      </div>
    </>
  )
}

export default Scanner
