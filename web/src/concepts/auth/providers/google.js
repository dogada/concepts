export { OAuth2Strategy as Strategy } from 'passport-google-oauth'

export function parseProfile(profile) {
  return {
    id: profile.id,
    name: profile.displayName,
    email:
      profile.emails && profile.emails[0].value ? profile.emails[0].value : ''
  }
}
