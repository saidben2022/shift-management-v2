interface ApiResponse<T = any> extends Response {
    data?: T;
}
declare class Api {
    private baseUrl;
    private axiosInstance;
    constructor(baseUrl: string);
    private getAuthToken;
    private handleResponse;
    get<T = any>(endpoint: string, options?: {
        params?: Record<string, any>;
    }): Promise<ApiResponse<T>>;
    post<T>(endpoint: string, data: any): Promise<any>;
    put<T = any>(endpoint: string, data: any): Promise<ApiResponse<T>>;
    delete<T = any>(endpoint: string): Promise<ApiResponse<T>>;
}
export declare const api: Api;
export {};
