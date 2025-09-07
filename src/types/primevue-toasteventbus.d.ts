declare module 'primevue/toasteventbus' {
  const toasteventbus: {
    emit: (type: string, payload?: any) => void;
    on?: (type: string, handler: (...args: any[]) => void) => void;
    off?: (type: string, handler: (...args: any[]) => void) => void;
  };
  export default toasteventbus;
}


