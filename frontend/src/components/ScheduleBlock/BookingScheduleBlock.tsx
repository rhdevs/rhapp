import React from 'react'
import ViewBooking from '../../routes/FacilityBooking/ViewBooking'
import { DailyContainer } from './BlockStyles'
import { APIEntry, BookingEntry, BookingStatusEntry } from '../../store/facilityBooking/types'
import { get24Hourtime } from '../../common/get24HourTime'
import AbstractPicker from 'antd-mobile/lib/picker/AbstractPicker'
import BookingBlock from './BookingBlock'
import ListEntry from './BookingBlock'

const N = 24
const fixedValues: BookingStatusEntry[] = [
  { id: 0, type: 'available' }, //0000 - 0100
  { id: 1, type: 'available' }, //0100 - 0200
  { id: 2, type: 'available' }, //0200 - 0300
  { id: 3, type: 'available' }, //0300 - 0400
  { id: 4, type: 'available' }, //0400 - 0500
  { id: 5, type: 'available' }, //0500 - 0600
  { id: 6, type: 'available' }, //0600 - 0700
  { id: 7, type: 'available' }, //0700 - 0800
  { id: 8, type: 'available' }, //0800 - 0900
  { id: 9, type: 'available' }, //0900 = 1000
  { id: 10, type: 'available' }, //1000 - 1100
  { id: 11, type: 'available' }, //1100 - 1200
  { id: 12, type: 'available' }, //1200 - 1300
  { id: 13, type: 'available' }, //1300 - 1400
  { id: 14, type: 'available' }, //1400 - 1500
  { id: 15, type: 'available' },
  { id: 16, type: 'available' },
  { id: 17, type: 'available' },
  { id: 18, type: 'available' },
  { id: 19, type: 'available' },
  { id: 20, type: 'available' },
  { id: 21, type: 'available' }, //2100 - 2200
  { id: 22, type: 'available' }, //2200 - 2300
  { id: 23, type: 'available' }, //2300 - 0000
]
/*

Algorithm: O(N^4) time
Take in data api response
1. repeat for all data (iterate through)
1. Process each entry, access starttime and endtime.
2. Use diff = get24Hourtime(endtime) - get24Hourtime(starttime)
3. for (int i = 0; i < diff; i++) {
    set occupied to true, ccaName to CCA, eventname to eventname
    }

*/

const getBlockHr = (s: string) => {
  s = s.slice(0, 2)
  if (s[0] === '0') {
    return Number(s[1])
  } else {
    return Number(s)
  }
}

const Updater = (resp: APIEntry[]) => {
  for (let j = 0; j < resp.length; j++) {
    const starttime = getBlockHr(get24Hourtime(resp[j].startTime).toString())
    const endtime = getBlockHr(get24Hourtime(resp[j].endTime).toString())
    const diff = starttime + (endtime - starttime)
    for (let i = starttime; i < diff; i++) {
      fixedValues[i].type = 'occupied'
    }
  }
}

const BookingScheduleBlock = (resp: APIEntry[]) => {
  Updater(resp)
  return (
    <DailyContainer>
      {fixedValues.map((t) => {
        return <BookingBlock key={t.id} bookingEntry={t} index={t.id} />
      })}
    </DailyContainer>
  )
}
export default BookingScheduleBlock
