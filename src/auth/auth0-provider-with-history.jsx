// auth0-provider-with-history.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'

function Auth0ProviderWithHistory({ children }) {
  const navigate = useNavigate()
  const domain = import.meta.env.VITE_AUTH0_DOMAIN
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE

  const onRedirectCallback = (appState) => {
    // Use appState returnTo or default to relative root '/'
    navigate(appState?.returnTo || '/', { replace: true })
  }

  const redirectUri = window.location.origin + (import.meta.env.BASE_URL || '/')

  const authorizationParams = {
    redirect_uri: redirectUri,
    scope: 'openid profile email'
  }

  if (audience) {
    authorizationParams.audience = audience
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={authorizationParams}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  )
}

export default Auth0ProviderWithHistory