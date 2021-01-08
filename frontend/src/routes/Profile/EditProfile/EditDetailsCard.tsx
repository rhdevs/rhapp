import React, { useState } from 'react'
import { Card, Select, AutoComplete } from 'antd'
import 'antd/dist/antd.css'
import deleteIcon from '../../../assets/cancel.svg'
import plusCircle from '../../../assets/plusCircle.svg'

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

// Visibility dropdown
const { Option } = Select

function handleChange(value) {
  console.log(`selected ${value}`)
}

const VisibilitySelector = () => {
  return (
    <Select defaultValue="Everybody" style={{ width: 120, float: 'right' }} onChange={handleChange}>
      <Option value="Everybody">Everybody</Option>
      <Option value="Friends">Friends</Option>
      <Option value="Only Me">Only Me</Option>
    </Select>
  )
}

// Search bar
const options = [{ value: 'Baa' }, { value: 'Basketball' }, { value: 'Badminton' }]

const Complete: React.FC = () => (
  <AutoComplete
    style={{ width: '120px', height: '22px' }}
    options={options}
    placeholder="search info.."
    filterOption={(inputValue, option) => option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
  />
)

const EditDetailsItem = (detailsItem: Details) => {
  const [searchInfoSelected, setSearchInfoSelected] = useState(false)

  function plusCircleClicked() {
    setSearchInfoSelected(!searchInfoSelected)
  }
  return (
    <div className="site-card-border-less-wrapper">
      <Card
        title={
          <span>
            <span style={{ fontSize: '20px' }}>
              <span style={{ display: 'inline-flex', flexDirection: 'column' }}>{detailsItem.title}</span>
              <img
                alt="plusCircle"
                style={{ marginLeft: 10, width: 15 }}
                src={String(plusCircle)}
                onClick={plusCircleClicked}
              />
              <VisibilitySelector />
            </span>
            {searchInfoSelected ? (
              <span style={{ display: 'block' }}>
                <Complete />
              </span>
            ) : (
              <></>
            )}
          </span>
        }
        bordered={false}
        style={{ width: '80vw' }}
        size={'small'}
      >
        <span style={{ backgroundColor: '#F5F5F5', padding: '1px 8px', borderRadius: '9px' }}>
          {detailsItem.description}
          <img alt="deleteIcon" style={{ marginLeft: 5, width: 6 }} src={String(deleteIcon)} />
        </span>
      </Card>
    </div>
  )
}

const renderEditDetailsItems = () => {
  return testData.map((data) => {
    return <EditDetailsItem key={data.id} title={data.title} id={data.id} description={data.description} />
  })
}

const EditDetailsCard = () => {
  return <div>{renderEditDetailsItems()}</div>
}

export default EditDetailsCard
