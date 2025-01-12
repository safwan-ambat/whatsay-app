export type CategoryType = {
    id: number;
    name: string;
    description: string;
    created_at: Date | string;
    updated_at: Date | string;
    order: number | string;
    icon_url: string;
    active: boolean;
    isPreferred?: boolean; // Optional field for user preference
}