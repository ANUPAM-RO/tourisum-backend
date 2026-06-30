import { Request, Response } from 'express';
import City from '../models/City';

export const getAllCities = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, state, search } = req.query;

    const query: any = { published: true };

    if (state) query.state = state;
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const cities = await City.find(query)
      .populate('state', 'name slug')
      .populate('popularPlaces', 'name slug images rating')
      .populate('hotels', 'name images pricePerNight starRating')
      .populate('restaurants', 'name images cuisine rating')
      .sort({ name: 1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));

    const total = await City.countDocuments(query);

    res.json({
      success: true,
      data: cities,
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

export const getCityBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const city = await City.findOne({ slug: req.params.slug, published: true })
      .populate('state', 'name slug')
      .populate('popularPlaces', 'name slug images rating category entryFee')
      .populate('hotels')
      .populate('restaurants');

    if (city) {
      res.json({ success: true, data: city });
    } else {
      res.status(404).json({ success: false, message: 'City not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCity = async (req: Request, res: Response): Promise<void> => {
  try {
    const city = await City.create(req.body);
    res.status(201).json({ success: true, data: city });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCity = async (req: Request, res: Response): Promise<void> => {
  try {
    const city = await City.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (city) {
      res.json({ success: true, data: city });
    } else {
      res.status(404).json({ success: false, message: 'City not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCity = async (req: Request, res: Response): Promise<void> => {
  try {
    const city = await City.findByIdAndDelete(req.params.id);

    if (city) {
      res.json({ success: true, message: 'City deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'City not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  getAllCities,
  getCityBySlug,
  createCity,
  updateCity,
  deleteCity,
};
