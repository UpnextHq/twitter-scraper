import { gotScraping } from 'got-scraping';
import pMemoize from 'p-memoize';
import ExpiryMap from 'expiry-map';
import crypto from 'crypto';
import { getProxy } from './proxy';
import { Tweet, getTweet } from './tweets';
import { TwitterAuth } from './auth';

function notNull<T>(x: T | null): x is T {
  return x !== null;
}

//It has been taken from https://github.com/mahrtayyab/tweety
type GetTweetDetailsResponse = any;

//keep guest token for 30 minutes
const guestTokenCache = new ExpiryMap(Math.round(6e4 * 30)); //30 minutes

const getCommonHeaders = () => {
  const REQUEST_USER_AGENT =
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36';
  const REQUEST_PLATFORMS = ['Linux', 'Windows'];

  return {
    authority: 'twitter.com',
    accept: 'application/json',
    'accept-language': 'en-PK,en;q=0.9',
    authorization:
      'Bearer AAAAAAAAAAAAAAAAAAAAAFQODgEAAAAAVHTp76lzh3rFzcHbmHVvQxYYpTw%3DckAlMINMjmCwxUcaXbAN4XqJVdgMJaHqNOFgPMK0zN1qLqLQCF',
    'content-type': 'application/json',
    referer: 'https://twitter.com/',
    'sec-ch-ua':
      '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform':
      REQUEST_PLATFORMS[Math.floor(Math.random() * REQUEST_PLATFORMS.length)],
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': REQUEST_USER_AGENT,
    'x-csrf-token': crypto.randomBytes(32).toString('hex'),
    'x-twitter-active-user': 'yes',
    'x-twitter-client-language': 'en',
  };
};

const getGuestToken = pMemoize(
  async (): Promise<string> => {
    const { body } = await gotScraping.post(
      'https://api.twitter.com/1.1/guest/activate.json',
      {
        headers: getCommonHeaders(),
        proxyUrl: getProxy()?.toString('http'),
      },
    );

    return JSON.parse(body).guest_token;
  },
  { cache: guestTokenCache },
);

const getTweetDetails = async (
  tweetId: string,
): Promise<GetTweetDetailsResponse> => {
  const guestToken = await getGuestToken();

  const { body } = await gotScraping.get({
    url: `https://twitter.com/i/api/graphql/1oIoGPTOJN2mSjbbXlQifA/TweetDetail`,
    proxyUrl: getProxy()?.toString('http'),
    searchParams: {
      variables: JSON.stringify({
        focalTweetId: tweetId,
        with_rux_injections: false,
        includePromotedContent: true,
        withCommunity: true,
        withQuickPromoteEligibilityTweetFields: true,
        withBirdwatchNotes: true,
        withDownvotePerspective: false,
        withReactionsMetadata: false,
        withReactionsPerspective: false,
        withVoice: true,
        withV2Timeline: true,
      }),
      features: JSON.stringify({
        blue_business_profile_image_shape_enabled: false,
        responsive_web_graphql_exclude_directive_enabled: true,
        verified_phone_label_enabled: false,
        responsive_web_graphql_timeline_navigation_enabled: true,
        responsive_web_graphql_skip_user_profile_image_extensions_enabled:
          false,
        tweetypie_unmention_optimization_enabled: true,
        vibe_api_enabled: true,
        responsive_web_edit_tweet_api_enabled: true,
        graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
        view_counts_everywhere_api_enabled: true,
        longform_notetweets_consumption_enabled: true,
        tweet_awards_web_tipping_enabled: false,
        freedom_of_speech_not_reach_fetch_enabled: false,
        standardized_nudges_misinfo: true,
        tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled:
          false,
        interactive_text_enabled: true,
        responsive_web_text_conversations_enabled: false,
        longform_notetweets_richtext_consumption_enabled: false,
        responsive_web_enhance_cards_enabled: false,
      }),
    },
    headers: {
      ...getCommonHeaders(),
      'x-guest-token': guestToken,
    },
  });

  return JSON.parse(body);
};

function getThreadTweetIds(tweetDetails: GetTweetDetailsResponse) {
  const threads: string[] = [];

  for (const entry of tweetDetails['data'][
    'threaded_conversation_with_injections_v2'
  ]['instructions'][0]['entries']) {
    if (entry['entryId'].toString().split('-')[0] === 'conversationthread') {
      for (const item of entry['content']['items']) {
        try {
          const tweetType = item['item']['itemContent']['tweetDisplayType'];
          const tweet = item['item']['itemContent']['tweet_results'][
            'result'
          ] as string;

          //TODO implement if needed
          // if (!this.__replied_to || this.__replied_to.id !== tweet['rest_id']) {
          if (tweetType === 'SelfThread') {
            //@ts-ignore
            threads.push(tweet['rest_id']);
          }
          // }
        } catch (e) {
          // Handle KeyError
        }
      }
    }
  }

  return threads;
}

const getThread = async (
  tweetId: string,
  auth: TwitterAuth,
): Promise<Tweet[]> => {
  const data = await getTweetDetails(tweetId);
  const threadIds = [tweetId, ...getThreadTweetIds(data)];

  const threadTweets = await Promise.all(
    threadIds.map((threadId) => getTweet(threadId, auth)),
  );

  let startTweet = threadTweets[0];

  //in case when the first tweet is a reply we need to get the previous tweets
  while (startTweet?.isReply && startTweet.inReplyToStatus?.id) {
    const replyTweet = await getTweet(startTweet.inReplyToStatus?.id, auth);

    threadTweets.unshift(replyTweet);

    startTweet = replyTweet;
  }

  return threadTweets
    .filter(notNull)
    .sort((a, b) => a.timestamp! - b.timestamp!);
};

export { getThread };
