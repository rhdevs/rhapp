import React from 'react'
import { Select } from 'antd'

import 'antd/dist/antd.css'
import styled from 'styled-components'
const { Option } = Select

const TagsContainer = styled.div`
  .ant-select:not(.ant-select-customize-input) .ant-select-selector {
    border-radius: 10px;
    box-shadow: 2px 2px lightgrey;
    max-height: 10vh;
    overflow: auto;
  }
`

function Tags({ options, defaultOptions }: { options: string[]; defaultOptions?: string[] }) {
  const handleChange = (value: string[]) => {
    console.log(`selected ${value}`)
  }

  return (
    <TagsContainer>
      <Select
        mode="multiple"
        allowClear
        style={{ width: '100%' }}
        placeholder="Please select"
        defaultValue={defaultOptions ?? []}
        onChange={handleChange}
      >
        {options.map((option, key) => (
          <Option value={option} key={key}>
            {option}
          </Option>
        ))}
      </Select>
    </TagsContainer>
  )
}

export default Tags
