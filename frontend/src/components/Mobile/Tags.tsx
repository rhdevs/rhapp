import React, { useState } from 'react'
import { Select } from 'antd'

import 'antd/dist/antd.css'
import styled from 'styled-components'
import { CCADetails, Profile } from '../../store/scheduling/types'
const { Option } = Select

const TagsContainer = styled.div`
  .ant-select:not(.ant-select-customize-input) .ant-select-selector {
    border-radius: 10px;
    box-shadow: 2px 2px lightgrey;
    max-height: 10vh;
    overflow: auto;
  }
`

function Tags({
  ccaOptions,
  profileOptions,
  options,
  defaultOptions,
  onChange,
}: {
  ccaOptions?: CCADetails[]
  profileOptions?: Profile[]
  options?: string[]
  defaultOptions?: string[]
  onChange?: (input: string[]) => void
}) {
  const handleChange = (value: string[]) => {
    if (onChange) onChange(value)
  }

  const [tagsIsOpen, setTagsIsOpen] = useState(false)

  const renderContent = () => {
    if (ccaOptions) {
      return ccaOptions.map((option, key) => (
        <Option value={option.ccaID} key={key} label={option.ccaName}>
          {option.ccaName}
        </Option>
      ))
    } else if (profileOptions) {
      return profileOptions.map((option, key) => (
        <Option value={option.userID} key={key} label={option.displayName}>
          {option.displayName}
        </Option>
      ))
    } else if (options) {
      return options.map((option, key) => (
        <Option value={option} key={key} label={option}>
          {option}
        </Option>
      ))
    }
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
        optionFilterProp="label"
        open={tagsIsOpen}
        onBlur={() => {
          setTagsIsOpen(false)
        }}
        onClick={() => {
          setTagsIsOpen(!tagsIsOpen)
        }}
        onSearch={() => {
          setTagsIsOpen(true)
        }}
      >
        {renderContent()}
      </Select>
    </TagsContainer>
  )
}

export default Tags
