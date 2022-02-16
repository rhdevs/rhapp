import React from 'react'
import ViewBooking from '../../routes/FacilityBooking/ViewBooking'
import { DailyContainer } from './BlockStyles'
import { APIEntry, ViewBookingEntry } from '../../store/facilityBooking/types'
import ViewBlock from './ViewBlock'
import { get24Hourtime } from '../../common/get24HourTime'
import AbstractPicker from 'antd-mobile/lib/picker/AbstractPicker'

const N = 24
const fixedValues: ViewBookingEntry[] = [
  { id: 0, ccaName: '', eventName: '', occupied: false },
  { id: 1, ccaName: '', eventName: '', occupied: false },
  { id: 2, ccaName: '', eventName: '', occupied: false },
  { id: 3, ccaName: '', eventName: '', occupied: false },
  { id: 4, ccaName: '', eventName: '', occupied: false },
  { id: 5, ccaName: '', eventName: '', occupied: false },
  { id: 6, ccaName: '', eventName: '', occupied: false },
  { id: 7, ccaName: '', eventName: '', occupied: false },
  { id: 8, ccaName: '', eventName: '', occupied: false },
  { id: 9, ccaName: '', eventName: '', occupied: false },
  { id: 10, ccaName: '', eventName: '', occupied: false },
  { id: 11, ccaName: '', eventName: '', occupied: false },
  { id: 12, ccaName: '', eventName: '', occupied: false },
  { id: 13, ccaName: '', eventName: '', occupied: false },
  { id: 14, ccaName: '', eventName: '', occupied: false },
  { id: 15, ccaName: '', eventName: '', occupied: false },
  { id: 16, ccaName: '', eventName: '', occupied: false },
  { id: 17, ccaName: '', eventName: '', occupied: false },
  { id: 18, ccaName: '', eventName: '', occupied: false },
  { id: 19, ccaName: '', eventName: '', occupied: false },
  { id: 20, ccaName: '', eventName: '', occupied: false },
  { id: 21, ccaName: '', eventName: '', occupied: false },
  { id: 22, ccaName: '', eventName: '', occupied: false },
  { id: 23, ccaName: '', eventName: '', occupied: false },
]
/*

Take in data api response
1. repeat for all data (iterate through)
1. Process each entry, access starttime and endtime.
2. Use diff = get24Hourtime(endtime) - get24Hourtime(starttime)
3. for (int i = 0; i < diff; i++) {
    set occupied to true, ccaName to CCA, eventname to eventname
    }

*/

const Updater = (resp: APIEntry[]) => {
  for (let j = 0; j < resp.length; j++) {
    const diff = Number(get24Hourtime(resp[j].endTime)) - Number(get24Hourtime(resp[j].startTime))
    for (let i = Number(resp[j].startTime[1].toString().slice(0, 2)); i <= diff; i++) {
      fixedValues[i].ccaName = 'CCA NAME HERE'
      fixedValues[i].eventName = resp[j].eventName
      fixedValues[i].occupied = true
    }
  }
}

const ViewScheduleBlock = (resp: APIEntry[]) => {
  Updater(resp)
  return <DailyContainer>{fixedValues.map((t) => ViewBlock(t))}</DailyContainer>
}
export default ViewScheduleBlock
