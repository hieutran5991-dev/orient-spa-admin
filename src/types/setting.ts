export interface Setting {
    key: string;
    value: string;
    is_public: boolean;
}

export interface SettingListResponse {
    message: string;
    data: Setting[];
}

export interface UpdateSettingRequest {
    settings: {
        key: string;
        value: string;
    }[];
}

export interface UpdateSettingResponse {
    message: string;
}