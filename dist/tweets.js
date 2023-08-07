"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTweet = exports.getLatestTweet = exports.getTweetsWhere = exports.getTweetWhere = exports.getTweetsByUserId = exports.getTweets = exports.fetchTweets = exports.features = void 0;
const api_1 = require("./api");
const profile_1 = require("./profile");
const timeline_v2_1 = require("./timeline-v2");
const timeline_async_1 = require("./timeline-async");
const json_stable_stringify_1 = __importDefault(require("json-stable-stringify"));
exports.features = (0, api_1.addApiFeatures)({
    interactive_text_enabled: true,
    longform_notetweets_inline_media_enabled: false,
    responsive_web_text_conversations_enabled: false,
    tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: false,
    vibe_api_enabled: false,
});
async function fetchTweets(userId, maxTweets, cursor, auth) {
    if (maxTweets > 200) {
        maxTweets = 200;
    }
    const variables = {
        includeHasBirdwatchNotes: false,
        rest_id: userId,
        count: maxTweets,
    };
    if (cursor != null && cursor != '') {
        variables['cursor'] = cursor;
    }
    const params = new URLSearchParams();
    params.set('variables', (0, json_stable_stringify_1.default)(variables));
    params.set('features', (0, json_stable_stringify_1.default)(exports.features));
    const res = await (0, api_1.requestApi)(`https://api.twitter.com/graphql/8IS8MaO-2EN6GZZZb8jF0g/UserWithProfileTweetsAndRepliesQueryV2?${params.toString()}`, auth);
    if (!res.success) {
        throw res.err;
    }
    return (0, timeline_v2_1.parseTimelineTweetsV2)(res.value);
}
exports.fetchTweets = fetchTweets;
function getTweets(user, maxTweets, auth) {
    return (0, timeline_async_1.getTweetTimeline)(user, maxTweets, async (q, mt, c) => {
        const userIdRes = await (0, profile_1.getUserIdByScreenName)(q, auth);
        if (!userIdRes.success) {
            throw userIdRes.err;
        }
        const { value: userId } = userIdRes;
        return fetchTweets(userId, mt, c, auth);
    });
}
exports.getTweets = getTweets;
function getTweetsByUserId(userId, maxTweets, auth) {
    return (0, timeline_async_1.getTweetTimeline)(userId, maxTweets, (q, mt, c) => {
        return fetchTweets(q, mt, c, auth);
    });
}
exports.getTweetsByUserId = getTweetsByUserId;
async function getTweetWhere(tweets, query) {
    const isCallback = typeof query === 'function';
    for await (const tweet of tweets) {
        const matches = isCallback
            ? await query(tweet)
            : checkTweetMatches(tweet, query);
        if (matches) {
            return tweet;
        }
    }
    return null;
}
exports.getTweetWhere = getTweetWhere;
async function getTweetsWhere(tweets, query) {
    const isCallback = typeof query === 'function';
    const filtered = [];
    for await (const tweet of tweets) {
        const matches = isCallback ? query(tweet) : checkTweetMatches(tweet, query);
        if (!matches)
            continue;
        filtered.push(tweet);
    }
    return filtered;
}
exports.getTweetsWhere = getTweetsWhere;
function checkTweetMatches(tweet, options) {
    return Object.keys(options).every((k) => {
        const key = k;
        return tweet[key] === options[key];
    });
}
async function getLatestTweet(user, includeRetweets, max, auth) {
    const timeline = getTweets(user, max, auth);
    // No point looping if max is 1, just use first entry.
    return max === 1
        ? (await timeline.next()).value
        : await getTweetWhere(timeline, { isRetweet: includeRetweets });
}
exports.getLatestTweet = getLatestTweet;
async function getTweet(id, auth) {
    const variables = {
        focalTweetId: id,
        includeHasBirdwatchNotes: false,
    };
    const params = new URLSearchParams();
    params.set('features', (0, json_stable_stringify_1.default)(exports.features));
    params.set('variables', (0, json_stable_stringify_1.default)(variables));
    const res = await (0, api_1.requestApi)(`https://api.twitter.com/graphql/83h5UyHZ9wEKBVzALX8R_g/ConversationTimelineV2?${params.toString()}`, auth);
    if (!res.success) {
        throw res.err;
    }
    const tweets = (0, timeline_v2_1.parseThreadedConversation)(res.value);
    return tweets.find((t) => t.id === id) ?? null;
}
exports.getTweet = getTweet;
//# sourceMappingURL=tweets.js.map