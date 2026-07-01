import { Request, Response } from 'express';
import Place from '../models/Place';
import State from '../models/State';
import { IUser } from '../models/User';

interface AuthRequest extends Request {
  user?: IUser;
}

export const getAllPlaces = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, category, state, city, search, minRating, maxBudget } = req.query;

    const query: any = { published: true };

    if (category) query.category = { $in: [category] };
    if (state) {
      const stateSlug = typeof state === 'string' ? state : String(state);
      const stateDoc = await State.findOne({ slug: stateSlug }).select('_id');
      query.state = stateDoc ? stateDoc._id : stateSlug;
    }
    if (city) query.city = city;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (minRating) query.rating = { $gte: Number(minRating) };

    const places = await Place.find(query)
      .populate('state', 'name slug')
      .populate('city', 'name slug')
      .sort({ rating: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));

    const total = await Place.countDocuments(query);

    res.json({
      success: true,
      data: places,
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

export const getPlaceBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const place = await Place.findOne({ slug: req.params.slug, published: true })
      .populate('state', 'name slug')
      .populate('city', 'name slug')
      .populate('hotels')
      .populate('restaurants')
      .populate('nearbySpots.place', 'name slug images category')
      .populate('reviews.user', 'name avatar');

    if (place) {
      res.json({ success: true, data: place });
    } else {
      res.status(404).json({ success: false, message: 'Place not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPlace = async (req: Request, res: Response): Promise<void> => {
  try {
    const place = await Place.create(req.body);
    res.status(201).json({ success: true, data: place });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePlace = async (req: Request, res: Response): Promise<void> => {
  try {
    const place = await Place.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (place) {
      res.json({ success: true, data: place });
    } else {
      res.status(404).json({ success: false, message: 'Place not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePlace = async (req: Request, res: Response): Promise<void> => {
  try {
    const place = await Place.findByIdAndDelete(req.params.id);

    if (place) {
      res.json({ success: true, message: 'Place deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Place not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { rating, comment, photos } = req.body;
    const place = await Place.findById(req.params.id);

    if (place) {
      place.reviews.push({
        user: req.user!._id,
        rating,
        comment,
        photos: photos || [],
      });

      const totalReviews = place.reviews.length;
      place.rating = place.reviews.reduce((acc, item) => acc + item.rating, 0) / totalReviews;

      await place.save();
      await place.populate('reviews.user', 'name avatar');
      res.json({ success: true, data: place });
    } else {
      res.status(404).json({ success: false, message: 'Place not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSimilarPlaces = async (req: Request, res: Response): Promise<void> => {
  try {
    const place = await Place.findById(req.params.id);

    if (place) {
      const similarPlaces = await Place.find({
        _id: { $ne: place._id },
        category: { $in: place.category },
        published: true,
      })
        .populate('state', 'name slug')
        .populate('city', 'name slug')
        .limit(6);

      res.json({ success: true, data: similarPlaces });
    } else {
      res.status(404).json({ success: false, message: 'Place not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategoryStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const categoryStats = await Place.aggregate([
      { $match: { published: true } },
      { $unwind: '$category' },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: categoryStats.map((item) => ({
        name: item._id,
        count: item.count,
      })),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  getAllPlaces,
  getPlaceBySlug,
  createPlace,
  updatePlace,
  deletePlace,
  addReview,
  getSimilarPlaces,
  getCategoryStats,
};
