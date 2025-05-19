declare module Category{
    export interface Record{
        id: string;
        name: string;
        description?: string;
        documentCount?: number;
    }
}