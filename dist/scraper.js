"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scraper = void 0;
const api_1 = require("./api");
const auth_1 = require("./auth");
const auth_user_1 = require("./auth-user");
const profile_1 = require("./profile");
const search_1 = require("./search");
const relationships_1 = require("./relationships");
const trends_1 = require("./trends");
const tweets_1 = require("./tweets");
const twUrl = 'https://twitter.com';
/**
 * An interface to Twitter's undocumented API.
 * - Reusing Scraper objects is recommended to minimize the time spent authenticating unnecessarily.
 */
class Scraper {
    /**
     * Creates a new Scraper object.
     * - Scrapers maintain their own guest tokens for Twitter's internal API.
     * - Reusing Scraper objects is recommended to minimize the time spent authenticating unnecessarily.
     */
    constructor(options) {
        this.options = options;
        this.token = api_1.bearerToken;
        this.useGuestAuth();
    }
    /**
     * Initializes auth properties using a guest token.
     * Used when creating a new instance of this class, and when logging out.
     * @internal
     */
    useGuestAuth() {
        this.auth = new auth_1.TwitterGuestAuth(this.token, this.getAuthOptions());
        this.authTrends = new auth_1.TwitterGuestAuth(this.token, this.getAuthOptions());
    }
    /**
     * Fetches a Twitter profile.
     * @param username The Twitter username of the profile to fetch, without an `@` at the beginning.
     * @returns The requested {@link Profile}.
     */
    async getProfile(username) {
        const res = await (0, profile_1.getProfile)(username, this.auth);
        return this.handleResponse(res);
    }
    /**
     * Fetches the user ID corresponding to the provided screen name.
     * @param screenName The Twitter screen name of the profile to fetch.
     * @returns The ID of the corresponding account.
     */
    async getUserIdByScreenName(screenName) {
        const res = await (0, profile_1.getUserIdByScreenName)(screenName, this.auth);
        return this.handleResponse(res);
    }
    /**
     * Fetches tweets from Twitter.
     * @param query The search query. Any Twitter-compatible query format can be used.
     * @param maxTweets The maximum number of tweets to return.
     * @param includeReplies Whether or not replies should be included in the response.
     * @param searchMode The category filter to apply to the search. Defaults to `Top`.
     * @returns An {@link AsyncGenerator} of tweets matching the provided filters.
     */
    searchTweets(query, maxTweets, searchMode = search_1.SearchMode.Top) {
        return (0, search_1.searchTweets)(query, maxTweets, searchMode, this.auth);
    }
    /**
     * Fetches profiles from Twitter.
     * @param query The search query. Any Twitter-compatible query format can be used.
     * @param maxProfiles The maximum number of profiles to return.
     * @returns An {@link AsyncGenerator} of tweets matching the provided filter(s).
     */
    searchProfiles(query, maxProfiles) {
        return (0, search_1.searchProfiles)(query, maxProfiles, this.auth);
    }
    /**
     * Fetches tweets from Twitter.
     * @param query The search query. Any Twitter-compatible query format can be used.
     * @param maxTweets The maximum number of tweets to return.
     * @param includeReplies Whether or not replies should be included in the response.
     * @param searchMode The category filter to apply to the search. Defaults to `Top`.
     * @param cursor The search cursor, which can be passed into further requests for more results.
     * @returns A page of results, containing a cursor that can be used in further requests.
     */
    fetchSearchTweets(query, maxTweets, searchMode, cursor) {
        return (0, search_1.fetchSearchTweets)(query, maxTweets, searchMode, this.auth, cursor);
    }
    /**
     * Fetches profiles from Twitter.
     * @param query The search query. Any Twitter-compatible query format can be used.
     * @param maxProfiles The maximum number of profiles to return.
     * @param cursor The search cursor, which can be passed into further requests for more results.
     * @returns A page of results, containing a cursor that can be used in further requests.
     */
    fetchSearchProfiles(query, maxProfiles, cursor) {
        return (0, search_1.fetchSearchProfiles)(query, maxProfiles, this.auth, cursor);
    }
    /**
     * Fetch the profiles a user is following
     * @param userId The user whose following should be returned
     * @param maxProfiles The maximum number of profiles to return.
     * @returns An {@link AsyncGenerator} of following profiles for the provided user.
     */
    getFollowing(userId, maxProfiles) {
        return (0, relationships_1.getFollowing)(userId, maxProfiles, this.auth);
    }
    /**
     * Fetch the profiles that follow a user
     * @param userId The user whose followers should be returned
     * @param maxProfiles The maximum number of profiles to return.
     * @returns An {@link AsyncGenerator} of profiles following the provided user.
     */
    getFollowers(userId, maxProfiles) {
        return (0, relationships_1.getFollowers)(userId, maxProfiles, this.auth);
    }
    /**
     * Fetches following profiles from Twitter.
     * @param userId The user whose following should be returned
     * @param maxProfiles The maximum number of profiles to return.
     * @param cursor The search cursor, which can be passed into further requests for more results.
     * @returns A page of results, containing a cursor that can be used in further requests.
     */
    fetchProfileFollowing(userId, maxProfiles, cursor) {
        return (0, relationships_1.fetchProfileFollowing)(userId, maxProfiles, this.auth, cursor);
    }
    /**
     * Fetches profile followers from Twitter.
     * @param userId The user whose following should be returned
     * @param maxProfiles The maximum number of profiles to return.
     * @param cursor The search cursor, which can be passed into further requests for more results.
     * @returns A page of results, containing a cursor that can be used in further requests.
     */
    fetchProfileFollowers(userId, maxProfiles, cursor) {
        return (0, relationships_1.fetchProfileFollowers)(userId, maxProfiles, this.auth, cursor);
    }
    /**
     * Fetches the current trends from Twitter.
     * @returns The current list of trends.
     */
    getTrends() {
        return (0, trends_1.getTrends)(this.authTrends);
    }
    /**
     * Fetches tweets from a Twitter user.
     * @param user The user whose tweets should be returned.
     * @param maxTweets The maximum number of tweets to return. Defaults to `200`.
     * @returns An {@link AsyncGenerator} of tweets from the provided user.
     */
    getTweets(user, maxTweets = 200) {
        return (0, tweets_1.getTweets)(user, maxTweets, this.auth);
    }
    /**
     * Fetches tweets from a Twitter user using their ID.
     * @param userId The user whose tweets should be returned.
     * @param maxTweets The maximum number of tweets to return. Defaults to `200`.
     * @returns An {@link AsyncGenerator} of tweets from the provided user.
     */
    getTweetsByUserId(userId, maxTweets = 200) {
        return (0, tweets_1.getTweetsByUserId)(userId, maxTweets, this.auth);
    }
    /**
     * Fetches the first tweet matching the given query.
     *
     * Example:
     * ```js
     * const timeline = scraper.getTweets('user', 200);
     * const retweet = await scraper.getTweetWhere(timeline, { isRetweet: true });
     * ```
     * @param tweets The {@link AsyncIterable} of tweets to search through.
     * @param query A query to test **all** tweets against. This may be either an
     * object of key/value pairs or a predicate. If this query is an object, all
     * key/value pairs must match a {@link Tweet} for it to be returned. If this query
     * is a predicate, it must resolve to `true` for a {@link Tweet} to be returned.
     * - All keys are optional.
     * - If specified, the key must be implemented by that of {@link Tweet}.
     */
    getTweetWhere(tweets, query) {
        return (0, tweets_1.getTweetWhere)(tweets, query);
    }
    /**
     * Fetches all tweets matching the given query.
     *
     * Example:
     * ```js
     * const timeline = scraper.getTweets('user', 200);
     * const retweets = await scraper.getTweetsWhere(timeline, { isRetweet: true });
     * ```
     * @param tweets The {@link AsyncIterable} of tweets to search through.
     * @param query A query to test **all** tweets against. This may be either an
     * object of key/value pairs or a predicate. If this query is an object, all
     * key/value pairs must match a {@link Tweet} for it to be returned. If this query
     * is a predicate, it must resolve to `true` for a {@link Tweet} to be returned.
     * - All keys are optional.
     * - If specified, the key must be implemented by that of {@link Tweet}.
     */
    getTweetsWhere(tweets, query) {
        return (0, tweets_1.getTweetsWhere)(tweets, query);
    }
    /**
     * Fetches the most recent tweet from a Twitter user.
     * @param user The user whose latest tweet should be returned.
     * @param includeRetweets Whether or not to include retweets. Defaults to `false`.
     * @returns The {@link Tweet} object or `null`/`undefined` if it couldn't be fetched.
     */
    getLatestTweet(user, includeRetweets = false, max = 200) {
        return (0, tweets_1.getLatestTweet)(user, includeRetweets, max, this.auth);
    }
    /**
     * Fetches a single tweet.
     * @param id The ID of the tweet to fetch.
     * @returns The {@link Tweet} object, or `null` if it couldn't be fetched.
     */
    getTweet(id) {
        if (this.auth instanceof auth_user_1.TwitterUserAuth) {
            return (0, tweets_1.getTweet)(id, this.auth);
        }
        else {
            return (0, tweets_1.getTweetAnonymous)(id, this.auth);
        }
    }
    async getThread(id) {
        const tweet = await this.getTweet(id);
        const omit = (tw) => {
            const { inReplyToStatus, quotedStatus, thread, ...rest } = tw;
            return { ...rest };
        };
        const finalTweet = tweet?.inReplyToStatusId && tweet.thread.length === 0
            ? await this.getTweet(tweet.inReplyToStatusId)
            : tweet;
        if (finalTweet) {
            if (finalTweet.thread) {
                return [
                    ...finalTweet.thread.map((item) => omit(item)),
                    omit(finalTweet),
                ]
                    .map((item) => {
                    return {
                        ...item,
                        id: item.id?.replace('conversationthread-', ''),
                        permanentUrl: item.permanentUrl?.replace('status/conversationthread-', 'status/'),
                    };
                })
                    .sort((a, b) => {
                    if (!b.inReplyToStatusId) {
                        return 1;
                    }
                    else if (!a.inReplyToStatusId) {
                        return -1;
                    }
                    else {
                        return a.inReplyToStatusId.localeCompare(b.inReplyToStatusId);
                    }
                });
            }
            return [finalTweet];
        }
        return [];
    }
    /**
     * Returns if the scraper has a guest token. The token may not be valid.
     * @returns `true` if the scraper has a guest token; otherwise `false`.
     */
    hasGuestToken() {
        return this.auth.hasToken() || this.authTrends.hasToken();
    }
    /**
     * Returns if the scraper is logged in as a real user.
     * @returns `true` if the scraper is logged in with a real user account; otherwise `false`.
     */
    async isLoggedIn() {
        return ((await this.auth.isLoggedIn()) && (await this.authTrends.isLoggedIn()));
    }
    /**
     * Login to Twitter as a real Twitter account. This enables running
     * searches.
     * @param username The username of the Twitter account to login with.
     * @param password The password of the Twitter account to login with.
     * @param email The password to log in with, if you have email confirmation enabled.
     */
    async login(username, password, email) {
        // Swap in a real authorizer for all requests
        const userAuth = new auth_user_1.TwitterUserAuth(this.token, this.getAuthOptions());
        await userAuth.login(username, password, email);
        this.auth = userAuth;
        this.authTrends = userAuth;
    }
    /**
     * Log out of Twitter.
     */
    async logout() {
        await this.auth.logout();
        await this.authTrends.logout();
        // Swap in guest authorizers for all requests
        this.useGuestAuth();
    }
    /**
     * Retrieves all cookies for the current session.
     * @returns All cookies for the current session.
     */
    async getCookies() {
        return await this.authTrends.cookieJar().getCookies(twUrl);
    }
    /**
     * Set cookies for the current session.
     * @param cookies The cookies to set for the current session.
     */
    async setCookies(cookies) {
        const userAuth = new auth_user_1.TwitterUserAuth(this.token, this.getAuthOptions());
        for (const cookie of cookies) {
            await userAuth.cookieJar().setCookie(cookie, twUrl);
        }
        this.auth = userAuth;
        this.authTrends = userAuth;
    }
    /**
     * Clear all cookies for the current session.
     */
    async clearCookies() {
        await this.auth.cookieJar().removeAllCookies();
        await this.authTrends.cookieJar().removeAllCookies();
    }
    /**
     * Sets the optional cookie to be used in requests.
     * @param _cookie The cookie to be used in requests.
     * @deprecated This function no longer represents any part of Twitter's auth flow.
     * @returns This scraper instance.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    withCookie(_cookie) {
        console.warn('Warning: Scraper#withCookie is deprecated and will be removed in a later version. Use Scraper#login or Scraper#setCookies instead.');
        return this;
    }
    /**
     * Sets the optional CSRF token to be used in requests.
     * @param _token The CSRF token to be used in requests.
     * @deprecated This function no longer represents any part of Twitter's auth flow.
     * @returns This scraper instance.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    withXCsrfToken(_token) {
        console.warn('Warning: Scraper#withXCsrfToken is deprecated and will be removed in a later version.');
        return this;
    }
    getAuthOptions() {
        return {
            fetch: this.options?.fetch,
            transform: this.options?.transform,
        };
    }
    handleResponse(res) {
        if (!res.success) {
            throw res.err;
        }
        return res.value;
    }
}
exports.Scraper = Scraper;
//# sourceMappingURL=scraper.js.map