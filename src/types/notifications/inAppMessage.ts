export type InAppMessageCount = {
    total_count: number,
    unread_count: number,
    read_count: number
}

export type InAppMessage = {
    id: string,
    is_read: boolean,
    was_targeted: boolean,
    title: string,
    sub_title: string,
    message: string,
    cta_text?: string,
    cta_description?: string,
    cta_in_app_link?: string,
    cta_external_link?: string,
    type: "info" | "warning",
    show_as_popup: boolean,
    created_at: Date,
    expires_at: Date
}