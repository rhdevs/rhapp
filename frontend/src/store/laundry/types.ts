// {
//   machineId: 6101,
//   locationId: 61,
//   userId: '1',
//   jobId: '2312',
//   type: 'Washing Machine',
//   startTime: 1608723138,
//   duration: 60,
//   job: 'Available',
// },
export enum WMStatus {
  AVAIL = 'Available',
  INUSE = 'In Use',
  UNCOLLECTED = 'Uncollected',
  COMPLETED = 'Completed',
  RESERVED = 'Reserved',
}
export type WashingMachine = {
  machineId: string
  locationId: string
  userId: string
  jobId: string
  type: string
  startTime: number
  duration: number
  job: WMStatus
}
