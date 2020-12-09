import React from 'react'

import 'antd/dist/antd.css'

function StatusCard({ status, serialNo }: { status: string; serialNo: number }) {
  return (
    <>
      {status}
      <br></br>
      {serialNo}
    </>
  )
}

export default StatusCard
