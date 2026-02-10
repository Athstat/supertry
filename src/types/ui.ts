export type RadioListOption = {
    label: string,
    value: string
}

export type DropdownOption = {
    label: string,
    value: string
}

export type TooltipData = {
    title?: string,
    description?: string
}

export type FilterListOption = {
    label: string,
    value: string
}

export type UserTopicReaction = {
    emoji: string,
    created_at: Date,
    updated_at: Date,
    topic: string
}

export type EmojiReactionCount = {
    emoji: string,
    reaction_count: number
}

export type TopicReactions = {
    user_reaction?: UserTopicReaction,
    all_reactions: EmojiReactionCount[]
}