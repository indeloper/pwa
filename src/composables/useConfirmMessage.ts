import { useConfirm } from 'primevue/useconfirm';
import { DEFAULT_DELETE_BUTTON_PROPS, DEFAULT_CANCEL_BUTTON_PROPS } from '@/constants';

export function useConfirmMessage() {
    const confirm = useConfirm();

    const confirmDeleteMessage = ({
        message = 'Вы уверены, что хотите удалить этот элемент?',
        header = 'Удаление элемента',
        icon = 'pi pi-exclamation-triangle',
        accept,
        reject,
    }: {
        message?: string;
        header?: string;
        icon?: string;
        accept: () => Promise<void>;
        reject?: () => Promise<void>;
    }) => {
        confirm.require({
            message: message,
            header: header,
            icon: icon,
            acceptProps: DEFAULT_DELETE_BUTTON_PROPS,
            rejectProps: DEFAULT_CANCEL_BUTTON_PROPS,
            accept: async () => {
                await accept();
            },
            reject: async () => {
                if (reject) {
                    await reject();
                }
            },
        });
    };

    return {
        confirmDeleteMessage,
    };
}