import AWS from 'aws-sdk'


if (!process.env.AWS_REGION) throw new Error('AWS_REGION is not defined')
if (!process.env.AWS_ACCESS_KEY_ID) throw new Error('AWS_ACCESS_KEY_ID is not defined')
if (!process.env.AWS_SECRET_ACCESS_KEY) throw new Error('AWS_SECRET_ACCESS_KEY is not defined')

AWS.config.update({
  region: process.env.AWS_REGION,
  credentials: new AWS.Credentials({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  })
})

if (!process.env.AWS_ENDPOINT) throw new Error('AWS_ENDPOINT is not defined')
const iotHandler = new AWS.IotData({ endpoint:process.env.AWS_ENDPOINT })


import { shadow } from './types'

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

export function responseHandler(err: any, data: any) {
  if (err) {
    console.error('Error updating device shadow:', err)
  } else {
    const newShadow = JSON.parse(data.payload)

    console.log('Device shadow updated:', newShadow)

    updateAppState(newShadow)
  }
}

export function updateDeviceShadow(event: any) {
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

  const params = {
    payload: JSON.stringify(payload),
    thingName: 'esp_lamp'
  }

  iotHandler.updateThingShadow(params, responseHandler)
}

export function getDeviceShadow() {
  const params = {
    thingName: 'esp_lamp'
  }

  iotHandler.getThingShadow(params, responseHandler)
}