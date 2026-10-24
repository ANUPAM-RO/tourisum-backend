import { Request, Response } from 'express';
import SiteSettings from '../models/SiteSettings';

const EDITABLE_FIELDS = ['siteName', 'tagline', 'description', 'contact', 'highlights', 'about', 'social'] as const;

// The settings document is created with schema defaults the first time it is read.
const getOrCreate = async () => (await SiteSettings.findOne()) ?? (await SiteSettings.create({}));

export const getSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json({ success: true, data: await getOrCreate() });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const settings = await getOrCreate();
    for (const field of EDITABLE_FIELDS) {
      if (req.body[field] !== undefined) settings.set(field, req.body[field]);
    }
    await settings.save();
    res.json({ success: true, data: settings });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
