import React from 'react'
import ViewBooking from '../../routes/FacilityBooking/ViewBooking'
import { DailyContainer } from './BlockStyles'
import { APIEntry, ViewBookingEntry } from '../../store/facilityBooking/types'
import ViewBlock from './ViewBlock'
import { get24Hourtime } from '../../common/get24HourTime'
import AbstractPicker from 'antd-mobile/lib/picker/AbstractPicker'

const N = 24
const fixedValues: ViewBookingEntry[] = [
  { id: 0, ccaName: '', eventName: '', occupied: false }, //0000 - 0100
  { id: 1, ccaName: '', eventName: '', occupied: false }, //0100 - 0200
  { id: 2, ccaName: '', eventName: '', occupied: false }, //0200 - 0300
  { id: 3, ccaName: '', eventName: '', occupied: false }, //0300 - 0400
  { id: 4, ccaName: '', eventName: '', occupied: false }, //0400 - 0500
  { id: 5, ccaName: '', eventName: '', occupied: false }, //0500 - 0600
  { id: 6, ccaName: '', eventName: '', occupied: false }, //0600 - 0700
  { id: 7, ccaName: '', eventName: '', occupied: false }, //0700 - 0800
  { id: 8, ccaName: '', eventName: '', occupied: false }, //0800 - 0900
  { id: 9, ccaName: '', eventName: '', occupied: false }, //0900 = 1000
  { id: 10, ccaName: '', eventName: '', occupied: false }, //1000 - 1100
  { id: 11, ccaName: '', eventName: '', occupied: false }, //1100 - 1200
  { id: 12, ccaName: '', eventName: '', occupied: false }, //1200 - 1300
  { id: 13, ccaName: '', eventName: '', occupied: false }, //1300 - 1400
  { id: 14, ccaName: '', eventName: '', occupied: false }, //1400 - 1500
  { id: 15, ccaName: '', eventName: '', occupied: false },
  { id: 16, ccaName: '', eventName: '', occupied: false },
  { id: 17, ccaName: '', eventName: '', occupied: false },
  { id: 18, ccaName: '', eventName: '', occupied: false },
  { id: 19, ccaName: '', eventName: '', occupied: false },
  { id: 20, ccaName: '', eventName: '', occupied: false },
  { id: 21, ccaName: '', eventName: '', occupied: false }, //2100 - 2200
  { id: 22, ccaName: '', eventName: '', occupied: false }, //2200 - 2300
  { id: 23, ccaName: '', eventName: '', occupied: false }, //2300 - 0000
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

const getBlockHr = (s: string) => {
  console.log('s value before:' + s)
  s = s.slice(0, 2)
  console.log('s value:' + s)
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
