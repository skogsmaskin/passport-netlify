import OAuth2Strategy, { InternalOAuthError, VerifyFunction } from 'passport-oauth2'

import { parseUserProfile } from './profile'
import APIError from './apiError'

const STRATEGY_NAME = 'netlify'
const PROVIDER_NAME = 'netlify'
const USER_PROFILE_URL = 'https://api.netlify.com/api/v1/users'
const AUTHORIZATION_URL = 'https://app.netlify.com/authorize'
const TOKEN_URL = 'https://api.netlify.com/oauth/token'

interface StrategyOptions {
  clientID: string
  clientSecret: string
  callbackURL: string
  state?: boolean
}

export default class Strategy extends OAuth2Strategy {
  constructor(options: StrategyOptions, verify: VerifyFunction) {
    const { state = false } = options
    const superOptions = {
      ...options,
      state,
      authorizationURL: AUTHORIZATION_URL,
      tokenURL: TOKEN_URL
    }
    super(superOptions, verify)
    this.name = STRATEGY_NAME
    this._oauth2.useAuthorizationHeaderforGET(true)
  }

  userProfile(accessToken: string, done: (error: Error | null, profile?: any) => void) {
    this._oauth2.get(USER_PROFILE_URL, accessToken, function(err, body, _) {
      let json
      if (err) {
        if (err.data) {
          try {
            json = JSON.parse(err.data)
          } catch (_) {} // tslint:disable-line no-empty
        }
        if (json && json.message) {
          return done(new APIError(json.message))
        }
        return done(new InternalOAuthError('Failed to fetch user profile', err))
      }
      const _body = body ? body.toString() : ''
      try {
        json = JSON.parse(_body)
      } catch (_) {
        return done(new Error('Failed to parse user profile (invalid JSON)'))
      }
      if (!Array.isArray(json)) {
        return done(new Error('Failed to read user profile data, expected array'))
      }
      const profile = parseUserProfile(json[0])
      profile.provider = PROVIDER_NAME
      profile._raw = _body
      profile._json = json[0]
      done(null, profile)
    })
  }
}
