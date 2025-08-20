import { describe, it, expect } from 'vitest';
import { useAuth } from '../useAuth';

describe('useAuth', () => {
    it('should login', async () => {
        const { login } = useAuth();
        console.log(import.meta.env);
        
        const response = await login(import.meta.env.VITE_TEST_USER_EMAIL, import.meta.env.VITE_TEST_USER_PASSWORD);
        console.log(response);
        
        expect(response).toBeDefined();
    });
});