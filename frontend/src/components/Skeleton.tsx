import React from 'react'

import styled from 'styled-components'
import { Skeleton as AntdSkeleton } from 'antd'

const StyledSkeleton = styled(AntdSkeleton)<{
  width?: string
  height?: string
  margin?: string
  borderRadius?: string
}>`
  width: ${(props) => props.width ?? '100px'};
  &.ant-skeleton.ant-skeleton-active .ant-skeleton-content .ant-skeleton-title,
  .ant-skeleton.ant-skeleton-active .ant-skeleton-content .ant-skeleton-paragraph > li {
    height: ${(props) => props.height ?? '12px'};
    margin: ${(props) => props.margin ?? '5px 0'};
    ${(props) => props.borderRadius && `border-radius: ${props.borderRadius};`}
  }
`

type Props = {
  height?: string // default height: 12px
  width?: string // default width: 100px
  image?: boolean // default size 80 x 80 px, 10px border radius
  margin?: string
  borderRadius?: string
}
export const Skeleton = (props: Props) => {
  return (
    <StyledSkeleton
      active
      paragraph={false}
      {...(props.image && { borderRadius: '10px' })}
      height={props.image ? '80px' : props.height}
      width={props.image ? '80px' : props.width}
      margin={props.margin}
      borderRadius={props.borderRadius}
    />
  )
}
