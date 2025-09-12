import { useConfirm } from 'primevue/useconfirm';
import { DEFAULT_DELETE_BUTTON_PROPS, DEFAULT_CANCEL_BUTTON_PROPS, DEAFULT_CONFIRM_BUTTON_PROPS } from '@/constants';
import { ref } from 'vue';

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

    const confirmEmptyFields = async ({
        header = 'Подтверждение сохранения пустых полей',
        fields,
        requireJustification = false,
        accept,
        reject,
    }: {
        header?: string;
        fields: { label: string; name: string }[];
        requireJustification?: boolean;
        accept: (payload: { justification?: string }) => Promise<void> | void;
        reject?: () => Promise<void> | void;
    }) => {
        console.log('confirmEmptyFields', { fields, requireJustification, accept, reject });
        const justification = ref('');

        return new Promise<void>((resolve) => {
            confirm.require({
                group: 'confirm-empty-fields',
                header,
                message: ({ fields, requireJustification, justification } as unknown) as any,
                acceptProps: DEAFULT_CONFIRM_BUTTON_PROPS,
                rejectProps: DEFAULT_CANCEL_BUTTON_PROPS,
                accept: async () => {
                    await accept({ justification: justification.value || undefined });
                    resolve();
                },
                reject: async () => {
                    if (reject) await reject();
                    resolve();
                }
            } as any);
        });
    };

    return {
        confirmDeleteMessage,
        confirmEmptyFields,
    };
}