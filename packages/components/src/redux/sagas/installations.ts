import _ from 'lodash'
import qs from 'qs'
import {
  all,
  delay,
  fork,
  put,
  race,
  select,
  take,
  takeEvery,
} from 'redux-saga/effects'
import url from 'url'

import { Installation, refreshUserInstallations } from '@devhub/core'
import { bugsnag } from '../../libs/bugsnag'
import { Linking } from '../../libs/linking'
import { getDefaultDevHubHeaders } from '../../utils/api'
import { clearQueryStringFromURL } from '../../utils/helpers/auth'
import * as actions from '../actions'
import * as selectors from '../selectors'
import { ExtractActionFromActionCreator } from '../types/base'

// Fetch new installation tokens every 50 minutes
// Check for expired tokens every 5 minutes
function* init() {
  while (true) {
    yield race({
      delay: delay(1000 * 60 * 5), // 5 minutes
      action: take(['LOGIN_SUCCESS', 'LOGIN_FAILURE', 'LOGOUT']),
    })

    const state = yield select()

    const isLogged = selectors.isLoggedSelector(state)
    if (!isLogged) continue

    const lastFetchedAt = selectors.installationsLastFetchedRequestAtSelector(
      state,
    )
    const fetchedNMinutesAgo = lastFetchedAt
      ? (new Date().valueOf() - new Date(lastFetchedAt).valueOf()) / 1000 / 60
      : undefined

    const installations = selectors.installationsArrSelector(state)
    const hasExpiredInstallationToken = installations.some(
      installation =>
        installation &&
        installation.tokenDetails &&
        installation.tokenDetails.expiresAt &&
        new Date(installation.tokenDetails.expiresAt).valueOf() <
          new Date().valueOf(),
    )

    const installationIdFromQuery = (() => {
      const uri = Linking.getCurrentURL() || ''
      const querystring = url.parse(uri).query || ''
      const query = qs.parse(querystring)

      clearQueryStringFromURL(['installation_id', 'setup_action'])
      return query.installation_id
    })()

    // only fetch installations tokens if:
    // 1. never fetched
    // 2. or there are expired ones
    // 3. or havent fetched for 50+ minutes
    // 4. or just installed the github app on a repo
    if (
      lastFetchedAt &&
      !(
        hasExpiredInstallationToken ||
        (fetchedNMinutesAgo && fetchedNMinutesAgo > 50)
      ) &&
      !installationIdFromQuery
    ) {
      yield put(actions.refreshInstallationsNoop())
      continue
    }

    yield put(
      actions.refreshInstallationsRequest({
        // includeInstallationRepositories: isFirstTime,
        includeInstallationToken: true,
      }),
    )
  }
}

function* onRefreshInstallationsRequest(
  action: ExtractActionFromActionCreator<
    typeof actions.refreshInstallationsRequest
  >,
) {
  const noGitHubAppTokenMessage = 'No GitHub App token.'

  try {
    const state = yield select()

    const appToken = selectors.appTokenSelector(state)
    if (!appToken) throw new Error('Not logged')

    const githubAppToken = selectors.githubAppTokenSelector(state)
    if (!githubAppToken) throw new Error(noGitHubAppTokenMessage)

    const {
      // includeInstallationRepositories,
      includeInstallationToken,
    } = action.payload

    const response: Installation[] = yield refreshUserInstallations(
      {
        // includeInstallationRepositories,
        includeInstallationToken,
      },
      getDefaultDevHubHeaders({ appToken }),
    )

    yield put(actions.refreshInstallationsSuccess(response))
  } catch (error) {
    console.error('Failed to fetch installations', error)
    if (!(error && error.message === noGitHubAppTokenMessage)) {
      bugsnag.notify(error)
    }

    yield put(actions.refreshInstallationsFailure(error))
  }
}

export function* installationSagas() {
  yield all([
    yield fork(init),
    yield takeEvery(
      'REFRESH_INSTALLATIONS_REQUEST',
      onRefreshInstallationsRequest,
    ),
  ])
}
