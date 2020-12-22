import React from 'react'
import { Card } from 'antd'
import 'antd/dist/antd.css'

interface Details {
  title: string
  description: string
  id: number
}

const testData: Details[] = [
  {
    title: 'CCAs',
    description: 'RHdevs',
    id: 1,
  },
  {
    title: 'Modules',
    description: 'ABC1001',
    id: 2,
  },
]

const DetailsItem = (detailsItem: Details) => {
  return (
    <div className="site-card-border-less-wrapper">
      <Card
        title={<span style={{ fontSize: '20px' }}>{detailsItem.title}</span>}
        bordered={false}
        style={{ width: '80vw' }}
        size={'small'}
      >
        <span style={{ backgroundColor: '#F5F5F5', padding: '1px 8px', borderRadius: '9px' }}>
          {detailsItem.description}
        </span>
      </Card>
    </div>
  )
}

const renderDetailsItems = () => {
  return testData.map((data) => {
    return <DetailsItem key={data.id} title={data.title} id={data.id} description={data.description} />
  })
}

const DetailsCard = () => {
  return <div>{renderDetailsItems()}</div>
}

export default DetailsCard
