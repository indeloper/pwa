import { useAuthApi } from "@/composables";

export default class MaterialOperationApi {
    static async fetchAllStream() {
        const response = await useAuthApi().getStream('/material-operations-stream-test', {
            withCredentials: true,
            onMessage: (data) => {
                console.log('stream');
            }
        });
        // const response = await useAuthApi().get('/material-operations-data');
        return response;

    }

    static async fetchData() {
        const response = await useAuthApi().get('/material-operations-data');
        return response;
    }

    
}