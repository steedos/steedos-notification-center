import { constants, SteedosObjectColumnSubscription } from '@devhub/core'
import { select } from 'redux-saga/effects'
import * as selectors from '../../redux/selectors'

export function authenticate(token: string | null) {
  try {
    if (!token) {
      return false
    }

    return true
  } catch (e) {
    return false
  }
}

const cache: Record<string, Pick<any, 'data' | 'headers' | 'status'>> = {}

export async function getSteedosObject<
  T extends SteedosObjectColumnSubscription['subtype']
>(
  type: T,
  subscription: any,
  subscriptionParams: SteedosObjectColumnSubscription['params'],
  { githubToken = '', subscriptionId = '', useCache = true } = {},
) {
  const cacheKey = JSON.stringify([
    type,
    { subscriptionParams },
    subscriptionId,
  ])
  const cacheValue = cache[cacheKey]
  const url = constants.API_BASE_URL + '/api/v4/' + type + '?$top=50'

  try {
    const response = await fetch(url, {
      credentials: 'include',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    const { value } = await response.json()

    value.forEach((element: any) => {
      element.id = element._id
      element.html_url =
        constants.API_BASE_URL + '/app/devhub/' + type + '/view/' + element._id
      element.title = element.name
      element.updated_at = element.modified
      element.created_at = element.created
    })

    cache[cacheKey] = {
      data: value,
      headers: response.headers,
      status: response.status,
    }

    return cache[cacheKey]
  } catch (error) {
    if (error && error.status === 304) return cache[cacheKey]
    throw error
  }
}
