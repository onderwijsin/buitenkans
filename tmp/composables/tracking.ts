export type TrackingEvent = 'ai_action'

export type AiActionLabel = 'chatgpt' | 'claude' | 'markdown'
export type AiActionValue = 'sparren' | 'open_item' | 'copy' | 'view'

export interface TrackEventParams {
	event_category: 'engagement' | 'ui'
	event_label?: string
	event_value?: string
}

/**
 * Composable that exposes a thin wrapper around the global analytics `useTrackEvent` helper.
 *
 * This composable:
 * - Checks the current privacy/tracking consent via {@link usePrivacy}
 * - Ensures tracking is only executed on the client (`import.meta.client`)
 * - Forwards the event name and payload to `useTrackEvent` in a consistent shape
 *
 * Typical usage:
 *
 * ```ts
 * const { trackEvent } = useTracking()
 *
 * trackEvent('login', {
 *   event_category: 'auth',
 *   event_label: 'login_success',
 * })
 * ```
 *
 * @returns An object with:
 * - `trackEvent`: Function to send a typed tracking event with analytics payload.
 */
export const useTracking = () => {
	const { disabled } = useRuntimeConfig().public.tracking
	/**
	 * Send a tracking event to the analytics layer when tracking is allowed.
	 *
	 * The event is only sent when:
	 * - The user has consented to tracking (via {@link usePrivacy})
	 * - The code runs on the client (`import.meta.client`)
	 *
	 * @param event_name - Name of the event to track. Prefer one of the
	 *                     predefined {@link TrackingEvent} values, but arbitrary
	 *                     strings are also accepted for flexibility.
	 * @param payload - Analytics payload describing the event context, including
	 *                  category and optional label/value.
	 *
	 * @example
	 * ```ts
	 * const { trackEvent } = useTracking()
	 *
	 * trackEvent('app_installed', {
	 *   event_category: 'engagement',
	 *   event_label: 'pwa_install_prompt_accepted',
	 * })
	 * ```
	 */

	const trackEvent = (event_name: TrackingEvent, payload: TrackEventParams) => {
		if (disabled || !import.meta.client) return
		useTrackEvent(event_name, { props: { ...payload } })
	}

	/**
	 * Track a constrained AI-related action.
	 *
	 * @param params - AI action metadata.
	 * @returns Nothing.
	 */
	const trackAiAction = (params: { label: AiActionLabel; value: AiActionValue }): void => {
		trackEvent('ai_action', {
			event_category: 'engagement',
			event_label: params.label,
			event_value: params.value
		})
	}

	return {
		trackEvent,
		trackAiAction
	}
}
