import _ from 'lodash'

import { EnhancedSteedosObject } from '../types'
import { constants } from '../utils'

export function getOlderSteedosObjectDate(
  items: EnhancedSteedosObject[],
  field: 'created_at' | 'updated_at' = 'updated_at',
  ignoreFutureDates = true,
) {
  const now = Date.now()
  return sortSteedosObject(items, field, 'asc')
    .map(item => item[field])
    .filter(
      date =>
        !!(date && ignoreFutureDates ? now > new Date(date).getTime() : true),
    )[0]
}

export function sortSteedosObject(
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
