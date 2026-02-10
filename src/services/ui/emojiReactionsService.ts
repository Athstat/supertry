import { TopicReactions } from "../../types/ui";
import { getAuthHeader, getUri } from "../../utils/backendUtils";
import { logger } from "../logger"

/** Service for creating emoji reactions */
export const emojiReactionService = {

    getSummary: async (topic: string): Promise<TopicReactions | undefined> => {
        try {
            const uri = getUri(`/api/v1/emoji-reactions/${topic}`);
            const res = await fetch(uri, {
                headers: getAuthHeader(),
            });

            if (res.ok) {
                return (await res.json()) as TopicReactions;
            }

        } catch (err) {
            logger.error("Error fetching emoji reactions for topic ", err);
        }

        return undefined;
    },

    updateReaction: async (topic: string, emoji: string): Promise<boolean> => {
        try {

            const uri = getUri(`/api/v1/emoji-reactions/${topic}`);
            const res = await fetch(uri, {
                headers: getAuthHeader(),
                method: 'PUT',
                body: JSON.stringify({ emoji })
            });

            return res.ok;

        } catch (err) {
            logger.error("Error updating user reaction on topic ", err);
        }

        return false;
    },

    deleteReaction: async (topic: string): Promise<boolean> => {
        try {
            const uri = getUri(`/api/v1/emoji-reactions/${topic}`);
            const res = await fetch(uri, {
                headers: getAuthHeader(),
                method: 'DELETE'
            });

            return res.ok;

        } catch (err) {
            logger.error("Error fetching emoji reactions for topic ", err);
        }

        return false;
    },

    optmisticUpdateReaction: (topic: string, reactions: TopicReactions | undefined, emoji: string) : TopicReactions => {

        // apply optimistic update
        if (reactions) {

            // Remove old user reaction
            const prevUserReaction = reactions.user_reaction;

            if (prevUserReaction) {
                const prevUserReactionCountRecord = reactions.all_reactions.find((f) => {
                    return f.emoji === prevUserReaction.emoji;
                });


                if (prevUserReactionCountRecord && prevUserReactionCountRecord?.reaction_count == 1 ) {
                    reactions.all_reactions = reactions.all_reactions.filter((f) => {
                        return f.emoji !== prevUserReaction.emoji
                    });
                } else {
                    reactions.all_reactions = reactions.all_reactions.map((r) => {
                        if (r.emoji === prevUserReaction.emoji) {
                            return {...r, reaction_count: r.reaction_count - 1}
                        }

                        return r;
                    })
                }
            }

            const selected_reaction_count = reactions.all_reactions.find((r) => {
                return r.emoji.toLowerCase() === emoji.toLowerCase();
            })?.reaction_count ?? 0;

            return {
                user_reaction: {
                    emoji: emoji,
                    created_at: reactions.user_reaction?.created_at ?? new Date(),
                    updated_at: new Date(),
                    topic: topic
                },

                all_reactions: [
                    ...reactions.all_reactions.filter((r) => r.emoji.toLowerCase() !== emoji.toLowerCase()),
                    {
                        emoji, reaction_count: selected_reaction_count + 1
                    }
                ]
            }

        } else {
            return {
                user_reaction: {
                    emoji: emoji,
                    created_at: new Date(),
                    updated_at: new Date(),
                    topic: topic
                },

                all_reactions: [{ emoji, reaction_count: 1 }]
            }
        }
    },

    optimisticDelete: (reactions: TopicReactions | undefined, emoji: string) : TopicReactions => {
        
        if (!reactions) {
            return {user_reaction: undefined, all_reactions: []};
        }

        const selectedReactionCount = reactions.all_reactions.find((f) => f.emoji.toLowerCase() === emoji.toLowerCase())?.reaction_count ?? 0;

        return {
            user_reaction: undefined,
            all_reactions: [
                ...reactions.all_reactions.filter((f) => {
                    return f.emoji.toLowerCase() !== emoji.toLowerCase()
                }), 
                
                ...(selectedReactionCount === 1 ? [] : [{emoji, reaction_count: selectedReactionCount - 1}])
            ]
        }
    }
}