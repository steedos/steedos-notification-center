import React, { useCallback, useRef } from 'react'
import { StyleSheet, View } from 'react-native'

import {
  cheapestPlanWithNotifications,
  Column as ColumnT,
  columnHasAnyFilter,
  constants,
  EnhancedGitHubEvent,
  EnhancedGitHubIssueOrPullRequest,
  EnhancedGitHubNotification,
  EnhancedItem,
  formatPrice,
  getDefaultPaginationPerPage,
  GitHubIcon,
  isEventPrivate,
  isItemRead,
  isNotificationPrivate,
  ThemeColors,
} from '@devhub/core'
import { useDispatch, useStore } from 'react-redux'
import { useAppViewMode } from '../../hooks/use-app-view-mode'
import { useColumnData } from '../../hooks/use-column-data'
import { useReduxState } from '../../hooks/use-redux-state'
import { AutoSizer } from '../../libs/auto-sizer'
import { emitter } from '../../libs/emitter'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { sharedStyles } from '../../styles/shared'
import { contentPadding } from '../../styles/variables'
import {
  FreeTrialHeaderMessage,
  FreeTrialHeaderMessageProps,
} from '../common/FreeTrialHeaderMessage'
import { useAppLayout } from '../context/LayoutContext'
import { Column } from './Column'
import { ColumnFiltersRenderer } from './ColumnFiltersRenderer'
import { ColumnHeader } from './ColumnHeader'
import { ColumnOptionsAccordion } from './ColumnOptionsAccordion'

export function getColumnCardThemeColors({
  isDark,
}: {
  isDark: boolean
}): {
  column: keyof ThemeColors
  card: keyof ThemeColors
  card__hover: keyof ThemeColors
  card__muted: keyof ThemeColors
  card__muted_hover: keyof ThemeColors
} {
  return {
    card: 'backgroundColorLighther1',
    card__hover: isDark ? 'backgroundColorLighther2' : 'backgroundColorDarker1',
    card__muted: isDark ? 'backgroundColor' : 'backgroundColorDarker1',
    card__muted_hover: isDark
      ? 'backgroundColorLighther1'
      : 'backgroundColorDarker2',
    column: 'backgroundColor',
  }
}

export function getCardBackgroundThemeColor({
  isDark,
  isHovered,
  isMuted,
}: {
  isDark: boolean
  isHovered?: boolean
  isMuted: boolean
}) {
  const backgroundThemeColors = getColumnCardThemeColors({ isDark })

  const _backgroundThemeColor =
    (isMuted &&
      (isHovered
        ? backgroundThemeColors.card__muted_hover
        : backgroundThemeColors.card__muted)) ||
    (isHovered ? backgroundThemeColors.card__hover : backgroundThemeColors.card)

  return _backgroundThemeColor
}

export interface ColumnRendererProps {
  avatarImageURL?: string
  avatarLinkURL?: string
  children: React.ReactNode
  columnId: string
  columnIndex: number
  columnType: ColumnT['type']
  icon: GitHubIcon
  owner: string | undefined
  pagingEnabled?: boolean
  repo: string | undefined
  repoIsKnown: boolean
  subtitle: string | undefined
  title: string
}

export const ColumnRenderer = React.memo((props: ColumnRendererProps) => {
  const {
    avatarImageURL,
    avatarLinkURL,
    children,
    columnId,
    columnIndex,
    columnType,
    icon,
    owner,
    pagingEnabled,
    repo,
    repoIsKnown,
    subtitle,
    title,
  } = props

  const columnOptionsRef = useRef<ColumnOptionsAccordion>(null)
  const { appOrientation } = useAppLayout()
  const { appViewMode } = useAppViewMode()
  const { hasCrossedColumnsLimit, filteredItems } = useColumnData(columnId, {
    mergeSimilar: false,
  })
  const columnsCount = useReduxState(selectors.columnCountSelector)
  const plan = useReduxState(selectors.currentUserPlanSelector)
  const dispatch = useDispatch()
  const store = useStore()

  const clearableItems = (filteredItems as any[]).filter(
    (
      item:
        | EnhancedGitHubEvent
        | EnhancedGitHubNotification
        | EnhancedGitHubIssueOrPullRequest,
    ) => {
      return !!(item && !item.saved) /* && isItemRead(item) */
    },
  )

  const showBannerForPaidFeature: FreeTrialHeaderMessageProps | undefined =
    plan &&
    plan.featureFlags.columnsLimit >= 1 &&
    columnIndex + 1 > plan.featureFlags.columnsLimit
      ? columnIndex + 1 === plan.featureFlags.columnsLimit &&
        columnIndex + 1 === columnsCount &&
        columnIndex + 1 <= constants.COLUMNS_LIMIT
        ? {
            message: 'Columns limit reached. Tap for more.',
            relatedFeature: 'columnsLimit',
          }
        : undefined
      : (!(
          plan &&
          (plan.status === 'active' || plan.status === 'trialing') &&
          plan.featureFlags.enablePrivateRepositories
        ) &&
          (columnType === 'activity'
            ? (filteredItems as any[]).some((item: EnhancedGitHubEvent) =>
                isEventPrivate(item),
              )
            : columnType === 'notifications'
            ? (filteredItems as any[]).some(
                (item: EnhancedGitHubNotification) =>
                  isNotificationPrivate(item) && !!item.enhanced,
              )
            : // TODO: Handle for IssueOrPullRequest Column
              undefined) && {
            message:
              cheapestPlanWithNotifications &&
              cheapestPlanWithNotifications.amount
                ? `Unlock private repos for ${formatPrice(
                    cheapestPlanWithNotifications.amount,
                    cheapestPlanWithNotifications.currency,
                  )}/${cheapestPlanWithNotifications.interval}`
                : 'Tap to unlock Private Repositories',
            relatedFeature: 'enablePrivateRepositories',
          }) ||
        undefined

  const refresh = useCallback(() => {
    dispatch(
      actions.fetchColumnSubscriptionRequest({
        columnId,
        params: { page: 1, perPage: getDefaultPaginationPerPage(columnType) },
        replaceAllItems: false,
      }),
    )
  }, [columnId])

  function focusColumn() {
    emitter.emit('FOCUS_ON_COLUMN', {
      columnId,
      highlight: false,
      scrollTo: false,
    })
  }

  const toggleOptions = () => {
    if (!columnOptionsRef.current) return

    focusColumn()
    columnOptionsRef.current.toggle()
  }

  const hasOneUnreadItem = (filteredItems as any[]).some(
    (
      item:
        | EnhancedGitHubNotification
        | EnhancedGitHubEvent
        | EnhancedGitHubIssueOrPullRequest,
    ) => !isItemRead(item),
  )

  const renderLeftSeparator =
    appViewMode === 'multi-column' &&
    !(columnIndex === 0 && appOrientation === 'landscape')

  const renderRightSeparator = appViewMode === 'multi-column'

  return (
    <Column
      key={`column-renderer-${columnId}-inner-container`}
      backgroundColor={getColumnCardThemeColors({ isDark: false }).column}
      columnId={columnId}
      pagingEnabled={pagingEnabled}
      renderLeftSeparator={renderLeftSeparator}
      renderRightSeparator={renderRightSeparator}
    >
      <ColumnHeader
        key={`column-renderer-${columnId}-header`}
        columnId={columnId}
        title={title}
        subtitle={subtitle}
        style={{ paddingRight: contentPadding / 2 }}
        {...(avatarImageURL
          ? { avatar: { imageURL: avatarImageURL, linkURL: avatarLinkURL! } }
          : { icon })}
        right={
          <>
            <ColumnHeader.Button
              key="column-options-button-clear-column"
              analyticsLabel={
                clearableItems.length ? 'clear_column' : 'unclear_column'
              }
              disabled={hasCrossedColumnsLimit || !clearableItems.length}
              name="check"
              onPress={() => {
                dispatch(
                  actions.setColumnClearedAtFilter({
                    columnId,
                    clearedAt: clearableItems.length
                      ? new Date().toISOString()
                      : null,
                  }),
                )

                focusColumn()

                if (!clearableItems.length) refresh()
              }}
              tooltip="Clear items"
            />

            <ColumnHeader.Button
              key="column-options-button-toggle-mark-as-read"
              analyticsLabel={
                !hasOneUnreadItem ? 'mark_as_unread' : 'mark_as_read'
              }
              disabled={hasCrossedColumnsLimit || !filteredItems.length}
              name={!hasOneUnreadItem ? 'mail-read' : 'mail'}
              onPress={() => {
                const unread = !hasOneUnreadItem

                const visibleItemIds = (filteredItems as any[]).map(
                  (item: EnhancedItem) => item && item.id,
                )

                const column = selectors.columnSelector(
                  store.getState(),
                  columnId,
                )

                const hasAnyFilter = columnHasAnyFilter(columnType, {
                  ...(column && column.filters),
                  clearedAt: undefined,
                })

                // column doesnt have any filter,
                // so lets mark ALL notifications on github as read at once,
                // instead of marking only the visible items one by one
                if (
                  columnType === 'notifications' &&
                  !hasAnyFilter &&
                  !unread
                ) {
                  if (repoIsKnown) {
                    if (owner && repo) {
                      dispatch(
                        actions.markRepoNotificationsAsReadOrUnread({
                          owner,
                          repo,
                          unread,
                        }),
                      )

                      return
                    }
                  } else {
                    dispatch(
                      actions.markAllNotificationsAsReadOrUnread({ unread }),
                    )
                    return
                  }
                }

                // mark only the visible items as read/unread one by one
                dispatch(
                  actions.markItemsAsReadOrUnread({
                    type: columnType,
                    itemIds: visibleItemIds,
                    unread,
                  }),
                )

                focusColumn()
              }}
              tooltip={
                !hasOneUnreadItem ? 'Mark all as unread' : 'Mark all as read'
              }
            />

            <ColumnHeader.Button
              key="column-options-toggle-button"
              analyticsAction="toggle"
              analyticsLabel="column_options"
              name="gear"
              onPress={toggleOptions}
              tooltip="Options"
            />
          </>
        }
      />

      <View
        style={[
          sharedStyles.flex,
          sharedStyles.fullWidth,
          sharedStyles.fullHeight,
        ]}
      >
        <AutoSizer
          style={[
            sharedStyles.relative,
            sharedStyles.flex,
            sharedStyles.fullWidth,
            sharedStyles.fullHeight,
          ]}
        >
          {({ width, height }) => (
            <View style={StyleSheet.absoluteFill}>
              <ColumnOptionsAccordion
                ref={columnOptionsRef}
                columnId={columnId}
              />

              <View style={{ width, height }}>{children}</View>
            </View>
          )}
        </AutoSizer>
      </View>

      <ColumnFiltersRenderer
        key="column-options-renderer"
        columnId={columnId}
        fixedPosition="right"
        header="header"
        type="local"
      />

      {!!showBannerForPaidFeature && (
        <FreeTrialHeaderMessage {...showBannerForPaidFeature} />
      )}
    </Column>
  )
})

ColumnRenderer.displayName = 'ColumnRenderer'
