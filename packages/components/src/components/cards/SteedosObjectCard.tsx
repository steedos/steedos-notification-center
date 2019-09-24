import React from 'react'

import { EnhancedSteedosObject } from '@devhub/core'
import { BaseCardProps } from './BaseCard.shared'
import { CardWithLink } from './CardWithLink'

export interface SteedosObjectCardProps {
  cachedCardProps?: BaseCardProps | undefined
  columnId: string
  SteedosObject: EnhancedSteedosObject
  ownerIsKnown: boolean
  repoIsKnown: boolean
}

export const SteedosObjectCard = React.memo((props: SteedosObjectCardProps) => {
  const {
    cachedCardProps,
    columnId,
    SteedosObject,
    ownerIsKnown,
    repoIsKnown,
  } = props

  return (
    <CardWithLink
      type="issue_or_pr"
      repoIsKnown={repoIsKnown}
      ownerIsKnown={ownerIsKnown}
      item={SteedosObject}
      columnId={columnId}
      cachedCardProps={cachedCardProps}
    />
  )
})

SteedosObjectCard.displayName = 'SteedosObjectCard'
