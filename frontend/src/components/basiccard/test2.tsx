import React from 'react'
import bell from '../../assets/bell.svg'
import collect from '../../assets/collect.svg'
import reserve from '../../assets/reserve.svg'
import tickblack from '../../assets/tickblack.svg'
import tickred from '../../assets/tickred.svg'
import blank from '../../assets/blank.svg'
import { FacilityBooking } from './test'
import { available, using, uncollected, completed, reserved } from '../laundrypage/status'

const BasicCard = () => {
  return (
    <div>
      <FacilityBooking
        status={available}
        serial={'S/N 123456'}
        colour={'black'}
        action={reserve}
        caption={'Reserve'}
        timer={false}
      />
      <FacilityBooking
        status={using}
        serial={'S/N 123456'}
        colour={'#EB5757'}
        action={blank}
        caption={'remaining'}
        timer={true}
      />
      <FacilityBooking
        status={uncollected}
        serial={'S/N 123456'}
        colour={'#EB5757'}
        action={bell}
        caption={'Notify'}
        timer={false}
      />
      <FacilityBooking
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
