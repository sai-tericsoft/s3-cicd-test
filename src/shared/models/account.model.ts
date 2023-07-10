export interface IAccountLoginCredentials {
    email: string;
    password: string;
}

export interface ILoginResponse {
    token: string;
    user: ILoggedInUser;
}

export interface ILoggedInUser {
    _id: string;
    first_name: string;
    last_name: string;
    primary_email: string;
    gender: string;
    role: string;
    is_active: boolean;
    signature_url: string;
    signature: string;
    auto_lock_minutes: number;
    uneditable_after_days: string;
}

export interface ICheckLoginResponse {
    user: ILoggedInUser;
}


export interface ISystemSettingsConfig {
    other_settings: {
        auto_lock_minutes?: number,
        uneditable_after_days?: number
        buffer_time?: any
    },
    default_message?:string
}


