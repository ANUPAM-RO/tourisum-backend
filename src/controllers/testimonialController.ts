import { Request, Response } from 'express';
import Testimonial from '../models/Testimonial';

const EDITABLE = ['name', 'location', 'trip', 'rating', 'text', 'photo', 'published', 'order'] as const;

const pickEditable = (body: any) =>
  Object.fromEntries(EDITABLE.filter((k) => body[k] !== undefined).map((k) => [k, body[k]]));

const SORT = { order: 1, createdAt: -1 } as const;

export const getTestimonials = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = Math.min(Number(req.query.limit) || 12, 50);
    const testimonials = await Testimonial.find({ published: true }).sort(SORT).limit(limit).lean();
    res.json({ success: true, data: testimonials });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllTestimonialsAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const testimonials = await Testimonial.find().sort(SORT).lean();
    res.json({ success: true, data: testimonials });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const testimonial = await Testimonial.create(pickEditable(req.body));
    res.status(201).json({ success: true, data: testimonial });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, pickEditable(req.body), { new: true, runValidators: true });
    if (!testimonial) {
      res.status(404).json({ success: false, message: 'Review not found' });
      return;
    }
    res.json({ success: true, data: testimonial });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      res.status(404).json({ success: false, message: 'Review not found' });
      return;
    }
    res.json({ success: true, message: 'Review deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
