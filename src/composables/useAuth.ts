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
        console.log('🔑 Starting login process...');
        
        // Инициализация CSRF cookie для Sanctum (важно для cookie-based auth)
        console.log('🍪 Getting CSRF cookie...');
        await authApi.get('/sanctum/csrf-cookie');
        
        // Небольшая задержка для уверенности, что cookie установлен
        await new Promise(resolve => setTimeout(resolve, 100));
        
        console.log('🚀 Attempting login...');
        const response = await authApi.post<LoginResponse>('/login', request);
        
        console.log('✅ Login successful');
        router.push('/');

        return response;
    }



    const logout = async (): Promise<void> => {
        try {
            console.log('🚪 Starting logout process...');
            const response = await authApi.post('/logout');
            console.log('✅ Logout response:', response);
            
            // Проверяем, что logout прошел успешно
            console.log('🧹 Clearing all authentication cookies...');
            
            // Очищаем все связанные с аутентификацией куки
            const cookiesToClear = ['laravel_session', 'XSRF-TOKEN', 'remember_web'];
            cookiesToClear.forEach(cookieName => {
                // Очищаем для текущего домена
                document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                // Очищаем для поддомена (если есть)
                document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
                console.log(`🗑️ Cleared cookie: ${cookieName}`);
            });
            
            console.log('✅ Logout completed successfully');
        } catch (error) {
            console.error('❌ Logout error:', error);
            
            // Даже если серверный logout не удался, принудительно очищаем куки
            console.log('🧹 Force clearing cookies due to logout error...');
            const cookiesToClear = ['laravel_session', 'XSRF-TOKEN', 'remember_web'];
            cookiesToClear.forEach(cookieName => {
                document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
            });
        } finally {
            router.push('/login');
        }
    }

    const getUser = async (): Promise<User> => {
        const response = await authApi.get('/me');
        
        // Проверяем, есть ли пользователь в ответе
        if (!response || !response.id) {
            console.log('❌ No user data in response');
            throw new Error('No user data');
        }
        
        const user = UserAdapter.adapt(response);
        return user;
    }

    const isAuthenticated = computed(() => {
        // При cookie-based auth решайте по серверному ответу или состоянию стора
        return true;
    });

    return { login, logout, getUser, isAuthenticated };
}