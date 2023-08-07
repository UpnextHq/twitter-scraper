"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserIdByScreenName = exports.getProfile = exports.parseProfile = void 0;
const json_stable_stringify_1 = __importDefault(require("json-stable-stringify"));
const api_1 = require("./api");
function parseProfile(user, isBlueVerified) {
    const profile = {
        avatar: user.profile_image_url_https,
        banner: user.profile_banner_url,
        biography: user.description,
        followersCount: user.followers_count,
        followingCount: user.favourites_count,
        friendsCount: user.friends_count,
        mediaCount: user.media_count,
        isPrivate: user.protected,
        isVerified: user.verified,
        likesCount: user.favourites_count,
        listedCount: user.listed_count,
        location: user.location,
        name: user.name,
        pinnedTweetIds: user.pinned_tweet_ids_str,
        tweetsCount: user.statuses_count,
        url: `https://twitter.com/${user.screen_name}`,
        userId: user.id_str,
        username: user.screen_name,
        isBlueVerified: isBlueVerified ?? false,
    };
    if (user.created_at != null) {
        profile.joined = new Date(Date.parse(user.created_at));
    }
    const urls = user.entities?.url?.urls;
    if (urls?.length != null && urls?.length > 0) {
        profile.website = urls[0].expanded_url;
    }
    return profile;
}
exports.parseProfile = parseProfile;
async function getProfile(username, auth) {
    const params = new URLSearchParams();
    params.set('variables', (0, json_stable_stringify_1.default)({
        screen_name: username,
        withHighlightedLabel: true,
    }));
    const features = (0, api_1.addApiFeatures)({
        interactive_text_enabled: true,
        longform_notetweets_inline_media_enabled: false,
        responsive_web_text_conversations_enabled: false,
        tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: false,
        vibe_api_enabled: false,
    });
    params.set('features', (0, json_stable_stringify_1.default)(features));
    const res = await (0, api_1.requestApi)(`https://api.twitter.com/graphql/u7wQyGi6oExe8_TRWGMq4Q/UserResultByScreenNameQuery?${params.toString()}`, auth);
    if (!res.success) {
        return res;
    }
    const { value } = res;
    const { errors } = value;
    if (errors != null && errors.length > 0) {
        return {
            success: false,
            err: new Error(errors[0].message),
        };
    }
    const { result: user } = value.data.user_result;
    const { legacy } = user;
    if (user.rest_id == null || user.rest_id.length === 0) {
        return {
            success: false,
            err: new Error('rest_id not found.'),
        };
    }
    legacy.id_str = user.rest_id;
    if (legacy.screen_name == null || legacy.screen_name.length === 0) {
        return {
            success: false,
            err: new Error(`Either ${username} does not exist or is private.`),
        };
    }
    return {
        success: true,
        value: parseProfile(user.legacy, user.isBlueVerified),
    };
}
exports.getProfile = getProfile;
const idCache = new Map();
async function getUserIdByScreenName(screenName, auth) {
    const cached = idCache.get(screenName);
    if (cached != null) {
        return { success: true, value: cached };
    }
    const profileRes = await getProfile(screenName, auth);
    if (!profileRes.success) {
        return profileRes;
    }
    const profile = profileRes.value;
    if (profile.userId != null) {
        idCache.set(screenName, profile.userId);
        return {
            success: true,
            value: profile.userId,
        };
    }
    return {
        success: false,
        err: new Error('User ID is undefined.'),
    };
}
exports.getUserIdByScreenName = getUserIdByScreenName;
//# sourceMappingURL=profile.js.map