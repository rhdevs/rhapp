import React from 'react'
import { QRCode } from 'react-qrcode-logo'

import black_logo from '../assets/black_logo.png'

type Props = {
  hasNoImage?: boolean
  image?: string
  width?: number
  opacity?: number
  link: string
}

export const RhAppQrCode = (props: Props) => {
  return (
    <QRCode
      logoImage={props.hasNoImage ? undefined : props.image ?? black_logo}
      logoWidth={props.width ?? 50}
      logoOpacity={props.opacity ?? 0.87}
      value={props.link}
    />
  )
}
