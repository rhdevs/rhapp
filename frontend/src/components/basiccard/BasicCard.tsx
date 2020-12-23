import React from 'react'
import bell from '../../assets/bell.svg'
import collect from '../../assets/collect.svg'
import reserve from '../../assets/reserve.svg'
import blank from '../../assets/blank.svg'
import { WashingMachineCard } from './WashingMachineCard'
import { WashingMachineStatus } from '../laundrypage/status'

const BasicCard = () => {
  return (
    <div>
      <WashingMachineCard
        status={WashingMachineStatus.available}
        serial={'S/N 123456'}
        colour={'black'}
        action={reserve}
        caption={'Reserve'}
      />
      <WashingMachineCard
        status={WashingMachineStatus.using}
        serial={'S/N 123456'}
        colour={'#EB5757'}
        action={blank}
        caption={'remaining'}
      />
      <WashingMachineCard
        status={WashingMachineStatus.uncollected}
        serial={'S/N 123456'}
        colour={'#EB5757'}
        action={bell}
        caption={'Notify'}
      />
      <WashingMachineCard
        status={WashingMachineStatus.completed}
        serial={'S/N 123456'}
        colour={'#EB5757'}
        action={collect}
        caption={'collect'}
      />
    </div>
  )
}
export { BasicCard }
//EB5757
