import React, { useState } from 'react'
import { Laundry } from './Laundry'
import { available, using, edit, completed, reserved } from './status'

const LaundryPage = () => {
  return (
    <div>
      <Laundry status={available} serial={'S/N 050201'} />
      <Laundry status={reserved} serial={'S/N 050201'} />
      {/* <Laundry status={using} serial={'S/N 050201'} /> */}
      <Laundry status={edit} serial={'S/N 050201'} />
      <Laundry status={completed} serial={'S/N 050201'} />
    </div>
  )
}
export { LaundryPage }
