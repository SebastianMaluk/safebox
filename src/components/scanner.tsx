import { BarcodeScanner } from './zxing-scanner.tsx'

interface Props {
  setRut: (rut: string) => void
}

const Scanner = (props: Props) => {
  return (
    <>
      <div className="flex items-center justify-center">
        <BarcodeScanner setRut={props.setRut} />
      </div>
    </>
  )
}

export default Scanner
