import { useOidc } from '#/oidc'

/** See: https://docs.oidc-spa.dev/auto-logout */
export function AutoLogoutWarningOverlay() {
  const { autoLogoutState } = useOidc()

  if (!autoLogoutState.shouldDisplayWarning) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 text-white backdrop-blur-[10px]">
      <div>
        <p>Are you still there?</p>
        <p>
          You will be logged out in{' '}
          {autoLogoutState.secondsLeftBeforeAutoLogout}
        </p>
      </div>
    </div>
  )
}
