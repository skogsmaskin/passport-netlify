module.exports.OAuth2 = () => {
  return {
    useAuthorizationHeaderforGET: () => {
      //
    },
    get: (url: string, accessToken: string, callback: any): void => {
      callback(
        null,
        '{"id": "1234", "full_name": "Test", "email": "test@test.com", "avatar_url": null}',
        undefined
      )
    }
  }
}
