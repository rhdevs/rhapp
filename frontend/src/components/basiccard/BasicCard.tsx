import React from 'react'
import bell from '../../assets/bell.svg'
import collect from '../../assets/collect.svg'
import reserve from '../../assets/reserve.svg'
import blank from '../../assets/blank.svg'
import { WashingMachineCard } from './WashingMachineCard'
import { available, using, uncollected, completed } from '../laundrypage/status'

const BasicCard = () => {
  return (
    <div>
      <WashingMachineCard
        status={available}
        serial={'S/N 123456'}
        colour={'black'}
        action={reserve}
        caption={'Reserve'}
        timer={false}
      />
      <WashingMachineCard
        status={using}
        serial={'S/N 123456'}
        colour={'#EB5757'}
        action={blank}
        caption={'remaining'}
        timer={true}
      />
      <WashingMachineCard
        status={uncollected}
        serial={'S/N 123456'}
        colour={'#EB5757'}
        action={bell}
        caption={'Notify'}
        timer={false}
      />
      <WashingMachineCard
        status={completed}
        serial={'S/N 123456'}
        colour={'#EB5757'}
        action={collect}
        caption={'collect'}
        timer={false}
      />
    </div>
  )
}
export { BasicCard }
//EB5757
