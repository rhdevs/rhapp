import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { PATHS } from '../routes/Routes'

const AlertBox = styled.div`
  display: flex;
  width: 100%;
  height: 32px;
  margin: 10px 0px;
  background: #ff7373;
  justify-content: space-between;
  align-items: center;
`

const WarningText = styled.span`
  font-family: Lato;
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 20px;
  padding: 10px;
  color: #fffef4;
`

const ViewText = styled.a`
  font-family: Lato;
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 20px;
  padding: 10px;
  text-decoration-line: underline;
  color: #4d6daa;
`

export default function ConflictAlert() {
  const history = useHistory()
  return (
    <AlertBox>
      <WarningText> There are conflicts in your booking! </WarningText>
      <ViewText
        onClick={() => {
          history.push(PATHS.VIEW_FACILITY_CONFLICT)
        }}
      >
        View Conflicts
      </ViewText>
    </AlertBox>
  )
}
