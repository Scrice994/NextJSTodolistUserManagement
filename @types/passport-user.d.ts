export {};

declare global {
    namespace Express {
        export interface User{
            id: string
            tenantId?: string
            userRole: string
        }
    }
}