import { Request, Response } from 'express';
import State from '../models/State';

export const getAllStates = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, search } = req.query;

    const query: any = { published: true };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const states = await State.find(query)
      .populate('popularCities', 'name slug image')
      .populate('popularPlaces', 'name slug images rating')
      .sort({ name: 1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));

    const total = await State.countDocuments(query);

    res.json({
      success: true,
      data: states,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStateBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const state = await State.findOne({ slug: req.params.slug, published: true })
      .populate('popularCities', 'name slug image description')
      .populate('popularPlaces', 'name slug images rating category entryFee');

    if (state) {
      res.json({ success: true, data: state });
    } else {
      res.status(404).json({ success: false, message: 'State not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createState = async (req: Request, res: Response): Promise<void> => {
  try {
    const state = await State.create(req.body);
    res.status(201).json({ success: true, data: state });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateState = async (req: Request, res: Response): Promise<void> => {
  try {
    const state = await State.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (state) {
      res.json({ success: true, data: state });
    } else {
      res.status(404).json({ success: false, message: 'State not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteState = async (req: Request, res: Response): Promise<void> => {
  try {
    const state = await State.findByIdAndDelete(req.params.id);

    if (state) {
      res.json({ success: true, message: 'State deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'State not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  getAllStates,
  getStateBySlug,
  createState,
  updateState,
  deleteState,
};
