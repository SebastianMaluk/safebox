import {
  IoTDataPlaneClient,
  GetThingShadowCommand,
  UpdateThingShadowCommand,
  UpdateThingShadowCommandInput,
  GetThingShadowCommandOutput,
  UpdateThingShadowCommandOutput
} from '@aws-sdk/client-iot-data-plane'

import { shadow } from './types'


if (!(import.meta.env.VITE_AWS_ACCESS_KEY_ID))
  throw new Error('AWS_ACCESS_KEY_ID is not defined')
if (!(import.meta.env.VITE_AWS_SECRET_ACCESS_KEY))
  throw new Error('AWS_SECRET_ACCESS_KEY is not defined')
if (!(import.meta.env.VITE_AWS_REGION)) throw new Error('AWS_REGION is not defined')
if (!(import.meta.env.VITE_AWS_ENDPOINT)) throw new Error('AWS_ENDPOINT is not defined')

const client = new IoTDataPlaneClient({ endpoint: process.env.AWS_ENDPOINT })


export function updateAppState(newShadow: shadow) {
  if (newShadow.state.desired.led.onboard === 0) {
    // offButton.disabled = true
    // onButton.disabled = false
    console.log('LED is off')
  } else {
    // offButton.disabled = false
    // onButton.disabled = true
    console.log('LED is on')
  }
}

function responseHandler(
  response: UpdateThingShadowCommandOutput | GetThingShadowCommandOutput
) {
  if (response.$metadata.httpStatusCode !== 200) {
    console.error('Error updating device shadow:', response.$metadata)
  } else {
    const responsePayload = new TextDecoder().decode(response.payload)
    const newShadow = JSON.parse(responsePayload)

    console.log('Device shadow updated:', JSON.stringify(newShadow.state, null, 2))

    updateAppState(newShadow)
  }
}

export async function updateDeviceShadow(event: any) {
  const { id } = event.target

  event.target.classList.add('loading')

  const ledValue = id === 'on' ? 1 : 0

  const payload = {
    state: {
      desired: {
        led: {
          onboard: ledValue
        }
      }
    }
  }
  const payloadUint8array = new TextEncoder().encode(JSON.stringify(payload))

  const input: UpdateThingShadowCommandInput = {
    thingName: 'esp_lamp',
    payload: Uint8Array.from(payloadUint8array)
  }
  const command = new UpdateThingShadowCommand(input)
  const response = await client.send(command)

  responseHandler(response)
}

export async function getDeviceShadow() {
  const params = {
    thingName: 'esp_lamp'
  }

  const command = new GetThingShadowCommand(params)
  const response = await client.send(command)
  if (response.$metadata.httpStatusCode === 200) {
    const responsePayload = new TextDecoder().decode(response.payload)
    const newShadow = JSON.parse(responsePayload)
    return newShadow
  }
  responseHandler(response)
}


// function main() {
//   getDeviceShadow()
// }

// main()
