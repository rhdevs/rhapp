import React, { useState } from 'react'
import { Laundry } from './Laundry'
import { WashingMachineStatus } from './status'

const LaundryPage = () => {
  return (
    <div>
      <Laundry status={WashingMachineStatus.available} serial={'S/N 050201'} />
      <Laundry status={WashingMachineStatus.reserved} serial={'S/N 050201'} />
      {/* <Laundry status={using} serial={'S/N 050201'} /> */}
      <Laundry status={WashingMachineStatus.edit} serial={'S/N 050201'} />
      <Laundry status={WashingMachineStatus.completed} serial={'S/N 050201'} />
    </div>
  )
}
export { LaundryPage }
