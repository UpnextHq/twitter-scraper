import { TwitterAuth } from './auth';
type FetchParameters = [input: RequestInfo | URL, init?: RequestInit];
export interface FetchTransformOptions {
    /**
     * Transforms the request options before a request is made. This executes after all of the default
     * parameters have been configured, and is stateless. It is safe to return new request options
     * objects.
     * @param args The request options.
     * @returns The transformed request options.
     */
    request: (...args: FetchParameters) => FetchParameters | Promise<FetchParameters>;
    /**
     * Transforms the response after a request completes. This executes immediately after the request
     * completes, and is stateless. It is safe to return a new response object.
     * @param response The response object.
     * @returns The transformed response object.
     */
    response: (response: Response) => Response | Promise<Response>;
}
export declare const bearerToken = "AAAAAAAAAAAAAAAAAAAAAFQODgEAAAAAVHTp76lzh3rFzcHbmHVvQxYYpTw%3DckAlMINMjmCwxUcaXbAN4XqJVdgMJaHqNOFgPMK0zN1qLqLQCF";
/**
 * An API result container.
 */
export type RequestApiResult<T> = {
    success: true;
    value: T;
} | {
    success: false;
    err: Error;
};
/**
 * Used internally to send HTTP requests to the Twitter API.
 * @internal
 *
 * @param url - The URL to send the request to.
 * @param auth - The instance of {@link TwitterAuth} that will be used to authorize this request.
 * @param method - The HTTP method used when sending this request.
 */
export declare function requestApi<T>(url: string, auth: TwitterAuth, method?: 'GET' | 'POST'): Promise<RequestApiResult<T>>;
/**
 * @internal
 */
export declare function addApiFeatures(o: object): {
    rweb_lists_timeline_redesign_enabled: boolean;
    responsive_web_graphql_exclude_directive_enabled: boolean;
    verified_phone_label_enabled: boolean;
    creator_subscriptions_tweet_preview_api_enabled: boolean;
    responsive_web_graphql_timeline_navigation_enabled: boolean;
    responsive_web_graphql_skip_user_profile_image_extensions_enabled: boolean;
    tweetypie_unmention_optimization_enabled: boolean;
    responsive_web_edit_tweet_api_enabled: boolean;
    graphql_is_translatable_rweb_tweet_is_translatable_enabled: boolean;
    view_counts_everywhere_api_enabled: boolean;
    longform_notetweets_consumption_enabled: boolean;
    tweet_awards_web_tipping_enabled: boolean;
    freedom_of_speech_not_reach_fetch_enabled: boolean;
    standardized_nudges_misinfo: boolean;
    longform_notetweets_rich_text_read_enabled: boolean;
    responsive_web_enhance_cards_enabled: boolean;
    subscriptions_verification_info_enabled: boolean;
    subscriptions_verification_info_reason_enabled: boolean;
    subscriptions_verification_info_verified_since_enabled: boolean;
    super_follow_badge_privacy_enabled: boolean;
    super_follow_exclusive_tweet_notifications_enabled: boolean;
    super_follow_tweet_api_enabled: boolean;
    super_follow_user_api_enabled: boolean;
    android_graphql_skip_api_media_color_palette: boolean;
    creator_subscriptions_subscription_count_enabled: boolean;
    blue_business_profile_image_shape_enabled: boolean;
    unified_cards_ad_metadata_container_dynamic_card_content_query_enabled: boolean;
};
export declare function addApiParams(params: URLSearchParams, includeTweetReplies: boolean): URLSearchParams;
export {};
//# sourceMappingURL=api.d.ts.map