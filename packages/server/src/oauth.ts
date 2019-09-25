import * as express from 'express'
import * as oauth from 'oauth'
const router = express.Router()

const GITHUB_OAUTH_CLIENT_ID = process.env.GITHUB_OAUTH_CLIENT_ID
const GITHUB_OAUTH_CLIENT_SECRET = process.env.GITHUB_OAUTH_CLIENT_SECRET
let ROOT_URL = process.env.ROOT_URL

if (!GITHUB_OAUTH_CLIENT_ID || !GITHUB_OAUTH_CLIENT_SECRET || !ROOT_URL)
  throw new Error(
    'Missing required environment variables: ROOT_URL, GITHUB_OAUTH_CLIENT_ID, GITHUB_OAUTH_CLIENT_SECRET',
  )

if (!ROOT_URL.endsWith('/')) ROOT_URL = ROOT_URL + '/'

const oauth2 = new oauth.OAuth2(
  GITHUB_OAUTH_CLIENT_ID,
  GITHUB_OAUTH_CLIENT_SECRET,
  'https://github.com/',
  'login/oauth/authorize',
  'login/oauth/access_token',
  undefined,
) /** Custom headers */

router.get('/github/oauth', (req: express.Request, res: express.Response) => {
  const authURL = oauth2.getAuthorizeUrl({
    redirect_uri: ROOT_URL + 'github/callback',
    scope: ['repo', 'notifications', 'user'],
    state: 'steedos',
  })
  res.redirect(authURL)
  res.end()
})

router.get(
  '/github/callback',
  (req: express.Request, res: express.Response) => {
    const code = req.query.code
    oauth2.getOAuthAccessToken(
      code,
      { grant_type: 'client_credentials' },
      (e: any, accessToken: string, refreshToken: string, results: any) => {
        const data = {
          app_token: 'to_be_generate',
          github_token: accessToken,
        }
        res.end(
          '<script>window.opener.postMessage(' +
            JSON.stringify(data) +
            ", '*');</script>",
        )
        res.end({})
      },
    )
  },
)

export default router
