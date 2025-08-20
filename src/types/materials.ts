export interface MaterialUnitResponse {
    id: number;
    type: string;
    attributes: {
        label: string;
        name: string;
        description: string | null;
    };
    relationships: {
        // У MaterialUnit пока нет связей с другими сущностями
    };
}

export interface MaterialTypeResponse {
    id: number;
    type: string;
    attributes: {
        name: string;
        unit_id: number;
        fixed_quantity: boolean;
        description: string | null;
        instruction: string | null;
    };
    relationships: {
        material_unit: MaterialUnitResponse;
        properties: MaterialPropertyResponse[];
    };
}

export interface MaterialPropertyResponse {
    id: number;
    type: string;
    attributes: {
        name: string;
        description: string | null;
        weight_factor: number;
    };
    relationships: {
        // У MaterialProperty пока нет связей с другими сущностями
    };
}

export interface MaterialBrandResponse {
    id: number;
    type: string;
    attributes: {
        name: string;
        description: string | null;
        weight: string;
    };
    relationships: {
        material_type: MaterialTypeResponse;
    };
}

export interface MaterialBrandRequest {
    id: number | undefined;
    name: string;
    description: string | null;
    weight: string;
    material_type_id: number;
}

export interface MaterialStandardResponse {
    id: number;
    type: string;
    attributes: {
        name: string;
        description: string | null;
        old_standard_id: number | null;
    };
    relationships: {
        material_type: MaterialTypeResponse;
        material_brand: MaterialBrandResponse;
        material_brands: MaterialBrandResponse[];
        properties: MaterialPropertyResponse[];
        alternative_standards: MaterialStandardResponse[];
    };
}
