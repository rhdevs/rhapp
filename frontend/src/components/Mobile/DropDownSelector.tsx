import React from 'react'
import 'antd/dist/antd.css'
import { Space, Select } from 'antd'

const { Option } = Select

export default function DropDownSelector({
  SelectedValue,
  ValueArray,
  handleChange,
}: {
  handleChange: (value: string) => void
  SelectedValue: string
  ValueArray: string[]
}) {
  return (
    <Space wrap>
      <Select defaultValue={SelectedValue} style={{ width: '160px' }} onChange={handleChange}>
        {ValueArray.map((value, index) => (
          <Option key={index} value={value}>
            {value}
          </Option>
        ))}
      </Select>
    </Space>
  )
}
