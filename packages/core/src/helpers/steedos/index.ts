import immer from 'immer'
import _ from 'lodash'

import {
  EnhancedSteedosObject,
  SteedosObject,
  SteedosObjectPayloadEnhancement,
} from '../../types/steedos'
import { constants } from '../../utils'

export function sortSteedosObjects(
  items: EnhancedSteedosObject[] | undefined,
  field: keyof EnhancedSteedosObject = 'updated_at',
  order: 'asc' | 'desc' = 'desc',
) {
  if (!(items && items.length)) return constants.EMPTY_ARRAY

  return _(items)
    .uniqBy('id')
    .orderBy(field, order)
    .value()
}

export function mergeSteedosObjectsPreservingEnhancement(
  newItems: EnhancedSteedosObject[],
  prevItems: EnhancedSteedosObject[],
  { dropPrevItems }: { dropPrevItems?: boolean } = {},
) {
  const allItems = dropPrevItems
    ? newItems || []
    : _.concat(newItems || [], prevItems || [])

  return sortSteedosObjects(
    _.uniqBy(allItems, 'id').map(item => {
      const newItem = (newItems || []).find(i => i.id === item.id)
      const existingItem = prevItems.find(i => i.id === item.id)

      return mergeSteedosObjectPreservingEnhancement(
        newItem!,
        existingItem,
      ) as any
    }),
  )
}

export function mergeSteedosObjectPreservingEnhancement(
  newItem: EnhancedSteedosObject,
  existingItem: EnhancedSteedosObject | undefined,
) {
  if (!(newItem && existingItem)) return newItem || existingItem

  delete newItem.last_read_at
  delete newItem.last_unread_at

  const enhancements: Record<
    keyof Omit<EnhancedSteedosObject, keyof SteedosObject>,
    any
  > = {
    enhanced: existingItem.enhanced,
    forceUnreadLocally: existingItem.forceUnreadLocally,
    last_read_at: _.max([existingItem.last_read_at, newItem.last_read_at]),
    last_unread_at: _.max([
      existingItem.last_unread_at,
      newItem.last_unread_at,
    ]),
    merged: existingItem.merged,
    private: existingItem.private,
    saved: existingItem.saved,
    unread: existingItem.unread,
  }

  return immer(newItem, draft => {
    Object.entries(enhancements).forEach(([key, value]) => {
      if (typeof value === 'undefined') return
      if (value === (draft as any)[key]) return
      if (typeof (draft as any)[key] !== 'undefined') return
      ;(draft as any)[key] = value
    })

    draft.updated_at = _.max([existingItem.updated_at, newItem.updated_at])!
  })
}

export function getOlderSteedosObjectDate(
  items: EnhancedSteedosObject[],
  field: 'created_at' | 'updated_at' = 'updated_at',
  ignoreFutureDates = true,
) {
  const now = Date.now()
  return sortSteedosObjects(items, field, 'asc')
    .map(item => item[field])
    .filter(
      date =>
        !!(date && ignoreFutureDates ? now > new Date(date).getTime() : true),
    )[0]
}

export function enhanceSteedosObjects(
  items: Array<SteedosObject | EnhancedSteedosObject>,
  enhancementMap: Record<string, SteedosObjectPayloadEnhancement>,
  currentEnhancedIssueOrPullRequests: EnhancedSteedosObject[] = [],
) {
  if (!(items && items.length)) return constants.EMPTY_ARRAY

  return items.map(item => {
    const enhanced = currentEnhancedIssueOrPullRequests.find(
      i => i.id === item.id,
    )

    const enhance = enhancementMap[item.id]
    if (!enhance) {
      if (!enhanced) return item
      return mergeSteedosObjectPreservingEnhancement(item, enhanced)
    }

    return {
      ...mergeSteedosObjectPreservingEnhancement(item, enhanced),
      ...enhance,
    } as EnhancedSteedosObject
  })
}
