import React from 'react'
import styled from 'styled-components'

const Tag = styled.div`
  padding: 1px 8px;
  border: 1px solid #de5f4c;
  border-radius: 15px;
  display: inline;
`

const PositionText = styled.text`
  font-family: Inter;
  font-size: 12px;
  font-weight: 500;
`

type Props = {
  position: string
}

export default function PostTag(props: Props) {
  const { position } = props
  const isAdmin = ['Hall Master', 'RH Admin', 'Blk 2 RF', 'Blk 3 RF'].indexOf(position) >= 0

  return (
    <Tag style={{ backgroundColor: isAdmin ? '#DE5F4C' : '#FAFAF4' }}>
      <PositionText style={{ color: isAdmin ? '#FAFAF4' : '#000' }}>{position}</PositionText>
    </Tag>
  )
}
