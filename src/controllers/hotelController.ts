import { Request, Response } from 'express';
import Hotel from '../models/Hotel';

export const getAllHotels = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, city, minPrice, maxPrice, amenities, search } = req.query;

    const query: any = { published: true };

    if (city) query.city = city;
    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
    }
    if (amenities) {
      query.amenities = { $in: Array.isArray(amenities) ? amenities : [amenities] };
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const hotels = await Hotel.find(query)
      .sort({ starRating: -1, pricePerNight: 1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));

    const total = await Hotel.countDocuments(query);

    res.json({
      success: true,
      data: hotels,
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

export const getHotelBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const hotel = await Hotel.findOne({ slug: req.params.slug, published: true });

    if (hotel) {
      res.json({ success: true, data: hotel });
    } else {
      res.status(404).json({ success: false, message: 'Hotel not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createHotel = async (req: Request, res: Response): Promise<void> => {
  try {
    const hotel = await Hotel.create(req.body);
    res.status(201).json({ success: true, data: hotel });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateHotel = async (req: Request, res: Response): Promise<void> => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (hotel) {
      res.json({ success: true, data: hotel });
    } else {
      res.status(404).json({ success: false, message: 'Hotel not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteHotel = async (req: Request, res: Response): Promise<void> => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);

    if (hotel) {
      res.json({ success: true, message: 'Hotel deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Hotel not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  getAllHotels,
  getHotelBySlug,
  createHotel,
  updateHotel,
  deleteHotel,
};
