import React, { useMemo } from 'react'

import { getColumnHeaderDetails } from '@devhub/core'
import {
  SteedosObjectCardsContainer,
  SteedosObjectCardsContainerProps,
} from '../../containers/SteedosObjectCardsContainer'
import { ColumnRenderer, ColumnRendererProps } from './ColumnRenderer'

export interface SteedosObjectColumnProps
  extends Omit<
    SteedosObjectCardsContainerProps,
    'ownerIsKnown' | 'repoIsKnown'
  > {
  columnId: string
  columnIndex: number
  headerDetails: ReturnType<typeof getColumnHeaderDetails>
  pagingEnabled?: boolean
}

export const SteedosObjectColumn = React.memo(
  (props: SteedosObjectColumnProps) => {
    const {
      columnId,
      columnIndex,
      headerDetails,
      pagingEnabled,
      pointerEvents,
      swipeable,
    } = props

    const Children = useMemo<ColumnRendererProps['children']>(
      () => (
        <SteedosObjectCardsContainer
          key={`steedos-object-cards-container-${columnId}`}
          columnId={columnId}
          columnIndex={columnIndex}
          ownerIsKnown={!!(headerDetails && headerDetails.ownerIsKnown)}
          pointerEvents={pointerEvents}
          repoIsKnown={!!(headerDetails && headerDetails.repoIsKnown)}
          swipeable={swipeable}
        />
      ),
      [
        columnId,
        columnIndex,
        pointerEvents,
        swipeable,
        headerDetails && headerDetails.ownerIsKnown,
        headerDetails && headerDetails.repoIsKnown,
      ],
    )

    if (!headerDetails) return null

    return (
      <ColumnRenderer
        key={`steedos-object-column-${columnId}-inner`}
        avatarImageURL={
          headerDetails.avatarProps && headerDetails.avatarProps.imageURL
        }
        avatarLinkURL={
          headerDetails.avatarProps && headerDetails.avatarProps.linkURL
        }
        columnId={columnId}
        columnIndex={columnIndex}
        columnType="steedos_object"
        icon={headerDetails.icon}
        owner={headerDetails.owner}
        pagingEnabled={pagingEnabled}
        repo={headerDetails.repo}
        repoIsKnown={headerDetails.repoIsKnown}
        subtitle={headerDetails.subtitle}
        title={headerDetails.title}
      >
        {Children}
      </ColumnRenderer>
    )
  },
)

SteedosObjectColumn.displayName = 'SteedosObjectColumn'
