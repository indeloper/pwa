import router from "../router";
import { useAuthApi } from "./useAuthApi";
import { computed } from "vue";
import type { LoginRequest, LoginResponse } from "../types/auth";
import { UserAdapter } from "../models/adapters/UserAdapter";
import type User from "../models/User";

export function useAuth() {
    const authApi = useAuthApi();

    const login = async (email: string, password: string): Promise<LoginResponse> => {
        const request: LoginRequest = { email, password };
        // Инициализация CSRF cookie для Sanctum (важно для cookie-based auth)
        await authApi.get(new URL('/api/v2/sanctum/csrf-cookie', import.meta.env.VITE_API_BASE_URL).toString());
        const response = await authApi.post<LoginResponse>(
            import.meta.env.VITE_API_BASE_URL + '/login', 
            request
        );
        router.push('/');

        return response;
    }

    const logout = async (): Promise<void> => {
        await authApi.post(import.meta.env.VITE_API_BASE_URL + '/logout');
        router.push('/login');
    }

    const getUser = async (): Promise<User> => {
        const response = await authApi.get('/me');
        return UserAdapter.adapt(response);
    }

    const isAuthenticated = computed(() => {
        // При cookie-based auth решайте по серверному ответу или состоянию стора
        return true;
    });

    return { login, logout, getUser, isAuthenticated };
}