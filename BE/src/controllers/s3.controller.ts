import { Request, Response } from 'express';

export const uploadImage = async (req: Request, res: Response) => {
    const file = req.file as (Express.Multer.File & { location?: string }) | undefined;
    res.json({ url: file?.location });
};
