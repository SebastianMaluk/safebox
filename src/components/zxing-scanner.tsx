import { useZxing } from 'react-zxing'

interface Props {
  setRut: (rut: string) => void
}

export const BarcodeScanner = (props: Props) => {
  const { ref } = useZxing({
    onResult(result) {
      const url = new URL(result.getText())
      const rutFormatted = url.searchParams.get('RUN')?.replace('-', '')
      if (!rutFormatted) props.setRut('No result')
      else props.setRut(rutFormatted.toString())
    }
  })

  return (
    <>
      <video ref={ref} />
    </>
  )
}
