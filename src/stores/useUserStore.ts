
import BaseResourceCollection from "@/models/BaseResourceCollection";
import User from "@/models/User";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore('user', () => {

    const usersLoading = ref(false);
    const users = ref<BaseResourceCollection<any>>(new BaseResourceCollection<any>([]));


    const loadUsers = async (): Promise<void> => {

            usersLoading.value = true;

        try {
            users.value = await User.fetchAll();
        } catch (error) {
            console.error('Error loading users:', error);
            throw error;
        } finally {
            usersLoading.value = false;
        }
    };


    return {
        users,
        usersLoading,
        loadUsers,
    };
});