import { Request, Response } from 'express';
import Restaurant from '../models/Restaurant';

export const getAllRestaurants = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, city, cuisine, vegNonVeg, search } = req.query;

    const query: any = { published: true };

    if (city) query.city = city;
    if (cuisine) query.cuisine = { $in: Array.isArray(cuisine) ? cuisine : [cuisine] };
    if (vegNonVeg) query.vegNonVeg = vegNonVeg;
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const restaurants = await Restaurant.find(query)
      .sort({ rating: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));

    const total = await Restaurant.countDocuments(query);

    res.json({
      success: true,
      data: restaurants,
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

export const getRestaurantBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const restaurant = await Restaurant.findOne({ slug: req.params.slug, published: true });

    if (restaurant) {
      res.json({ success: true, data: restaurant });
    } else {
      res.status(404).json({ success: false, message: 'Restaurant not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json({ success: true, data: restaurant });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (restaurant) {
      res.json({ success: true, data: restaurant });
    } else {
      res.status(404).json({ success: false, message: 'Restaurant not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);

    if (restaurant) {
      res.json({ success: true, message: 'Restaurant deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Restaurant not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  getAllRestaurants,
  getRestaurantBySlug,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
};
