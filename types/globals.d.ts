export { };

declare global {
    interface CustomJwtSessionClaims {
        metadata: {
            role?: 'admin' | 'editor' | 'viewer';
        };
    }
}
