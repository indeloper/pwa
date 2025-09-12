export default class BaseResource {
    // Do NOT assign a data property here to avoid shadowing decorator accessors
    get uuid(): string {
        return (this as any).__uuid ?? '';
    }
    set uuid(value: string) {
        (this as any).__uuid = value;
    }

    // ----------------------
    // Instance API (stubs for IDE typing; real implementations are injected by decorators)
    // ----------------------
    from(_strategy: string | symbol, _data: any): this { return this; }
    to(_strategy: string | symbol): any { return {}; }
    refresh(_other: Partial<this>): any { return this; }

    // Validation
    validationErrors(): Array<{ property: string; rule: any; message: string }>{ return []; }
    isValid(): boolean { return true; }
    validate(): boolean { return this.isValid(); }
    isRequired(_property: string): boolean { return false; }
    isUnsigned(_property: string): boolean { return false; }
    getMin(_property: string): number | undefined { return undefined; }
    getMax(_property: string): number | undefined { return undefined; }
    getMinLength(_property: string): number | undefined { return undefined; }
    getMaxLength(_property: string): number | undefined { return undefined; }

    // Resource instance helpers
    update(): Promise<any> { return Promise.resolve(this); }
    destroy(): Promise<void> { return Promise.resolve(); }
    getResourcePath(): string { return (this.constructor as any).resourcePath ?? ''; }
    getResourceKey(): string { return (this.constructor as any).resourceKey ?? 'id'; }
    getResourceStore(): any { return (this.constructor as any).resourceStore ?? undefined; }
    getFieldOption(_fieldName: string, _optionKey: string): any { return undefined; }
    getFieldDisplayValue(_fieldName: string, _value: any): string { return String(_value ?? ''); }

    // ----------------------
    // Static API (stubs)
    // ----------------------
    static collect(items: any[]): any { return new ((this as any).collection || Array)(items); }
    static createEmpty(): any { return new (this as any)(); }
    static clone(model: any): any { const inst = new (this as any)(); inst.refresh?.(model); return inst; }

    static resource(): { path: string; key: string; store?: any } { return { path: '', key: 'id' }; }
    static get resourcePath(): string { return (this as any)._resourcePath ?? ''; }
    static get resourceKey(): string { return (this as any)._resourceKey ?? 'id'; }
    static get resourceStore(): any { return (this as any)._resourceStore ?? undefined; }
    static buildPath(id?: string | number): string { const p = (this as any).resourcePath ?? ''; return id == null ? p : `${p}/${id}`; }

    static fetchAll(): Promise<any> { return Promise.resolve(((this as any).collect || ((x: any) => x))([])); }
    static fetchOne(_id: number | string): Promise<any> { return Promise.resolve(new (this as any)()); }
    static store(model: any): Promise<any> { return Promise.resolve(model); }

    static getFieldOption(_fieldName: string, _optionKey: string): any { return undefined; }
    static getFieldDisplayValue(_fieldName: string, _value: any): string { return String(_value ?? ''); }
}