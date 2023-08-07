import { LegacyUserRaw } from './profile';
import { LegacyTweetRaw, ParseTweetResult, QueryTweetsResponse, SearchResultRaw, TimelineResultRaw } from './timeline-v1';
import { Tweet } from './tweets';
export interface TimelineUserResultRaw {
    rest_id?: string;
    legacy?: LegacyUserRaw;
    is_blue_verified?: boolean;
}
export interface TimelineEntryItemContentRaw {
    tweetDisplayType?: string;
    tweetResult?: {
        result?: TimelineResultRaw;
    };
    userDisplayType?: string;
    user_results?: {
        result?: TimelineUserResultRaw;
    };
}
export interface TimelineEntryRaw {
    entryId: string;
    content?: {
        cursorType?: string;
        value?: string;
        items?: {
            item?: {
                content?: TimelineEntryItemContentRaw;
            };
        }[];
        content?: TimelineEntryItemContentRaw;
    };
}
export interface SearchEntryItemContentRaw {
    tweetDisplayType?: string;
    tweet_results?: {
        result?: SearchResultRaw;
    };
    userDisplayType?: string;
    user_results?: {
        result?: TimelineUserResultRaw;
    };
}
export interface SearchEntryRaw {
    entryId: string;
    sortIndex: string;
    content?: {
        cursorType?: string;
        entryType?: string;
        __typename?: string;
        value?: string;
        items?: {
            item?: {
                content?: SearchEntryItemContentRaw;
            };
        }[];
        itemContent?: SearchEntryItemContentRaw;
    };
}
export interface TimelineInstruction {
    entries: TimelineEntryRaw[];
    entry?: TimelineEntryRaw;
    type?: string;
}
export interface TimelineV2 {
    data?: {
        user_result?: {
            result?: {
                timeline_response?: {
                    timeline?: {
                        instructions: TimelineInstruction[];
                    };
                };
            };
        };
    };
}
export interface ThreadedConversation {
    data?: {
        timeline_response?: {
            instructions?: TimelineInstruction[];
        };
    };
}
export declare function parseLegacyTweet(user?: LegacyUserRaw, tweet?: LegacyTweetRaw): ParseTweetResult;
export declare function parseTimelineTweetsV2(timeline: TimelineV2): QueryTweetsResponse;
export declare function parseThreadedConversation(conversation: ThreadedConversation): Tweet[];
//# sourceMappingURL=timeline-v2.d.ts.map