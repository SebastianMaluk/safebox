export function cleanRut(rut: string) {
  // Remove all non-numeric characters, except for the last one
  rut = rut.toUpperCase()
  return rut.replace('-', '')
}

export function formatRut(rut: string) {
  // First, clean the rut to ensure correct formatting
  rut = cleanRut(rut)

  // Then, format the rut as 20.638.450-6
  let rutArray = rut.split('')
  rutArray.splice(rutArray.length - 1, 0, '-')
  rutArray.splice(rutArray.length - 5, 0, '.')
  rutArray.splice(rutArray.length - 9, 0, '.')
  return rutArray.join('')
}

function main() {
  let rut = '20638450-k'
  let cleanedRut = cleanRut(rut)
  let formattedRut = formatRut(cleanedRut)

  console.log(`Cleaned RUT: ${cleanedRut}`)
  console.log(`Formatted RUT: ${formattedRut}`)
}

main()
