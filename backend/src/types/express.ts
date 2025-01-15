import { Request } from 'express';

export interface AuthRequest extends Request {
    user?: {
        userId: number;
        isAdmin: boolean;
    }
}
