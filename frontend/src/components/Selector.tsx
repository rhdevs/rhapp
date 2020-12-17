/* eslint-disable prettier/prettier */
import React from 'react'
import 'antd/dist/antd.css'
import { Space } from 'antd'
import { Select } from 'antd';

const { Option } = Select;

function handleChange(value: unknown) {
  console.log(`selected ${value}`);
}


function Selector({
  SelectedValue, 
  ValueArray,
} : {
  SelectedValue : string
  ValueArray: string[]}) {
  const menu = (
    <>
    <Select defaultValue={SelectedValue} style={{ width: 120 }} onChange={handleChange}>
    {ValueArray.map((person, index) => (
      <Option key={index} value={person}>
      {person}
    </Option>
  ))}
    </Select>
    </>
  )

  return (
    <Space wrap>
      {menu}
    </Space>
  )
}

export default Selector

//Just have to input menutitle and block numbers for the options
