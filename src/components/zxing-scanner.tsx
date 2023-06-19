import { useZxing } from 'react-zxing'
import { Props } from './scanner'

export const BarcodeScanner = (props: Props) => {
  const { ref } = useZxing({
    onResult(result) {
      const url = new URL(result.getText())
      const rutFormatted = url.searchParams.get('RUN')?.replace('-', '')
      if (!rutFormatted) props.setRut('No result')
      else {
        props.setRut(rutFormatted.toString())
        props.setOpen(false)
      }
    }
  })

  return (
    <>
      <video ref={ref} />
    </>
  )
}
