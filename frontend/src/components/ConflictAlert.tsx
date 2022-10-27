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
type Props = {
  errorType: 'CONFLICT' | 'EMPTY_FIELD' | 'SERVER_ERROR'
}
interface ErrorMessage {
  [key: string]: string
}
const errorMessage: ErrorMessage = {
  CONFLICT: 'There are conflicts in your booking!',
  EMPTY_FIELD: 'Oops! There seems to be an empty field.',
  SERVER_ERROR: 'Server is down now please try again later.',
}

/**
 *
 * @param errorType ('CONFLICT' | 'EMPTY_FIELD' | 'SERVER_ERROR')
 * @returns
 * @remarks TODO unused!
 */

export default function ConflictAlert(props: Props) {
  const { errorType } = props
  const history = useHistory()
  return (
    <AlertBox>
      <WarningText> {errorMessage[errorType]} </WarningText>
      {errorType === 'CONFLICT' && (
        <ViewText
          onClick={() => {
            history.push(PATHS.VIEW_FACILITY_CONFLICT)
          }}
        >
          View Conflicts
        </ViewText>
      )}
    </AlertBox>
  )
}
