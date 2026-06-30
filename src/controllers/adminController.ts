import { Request, Response } from 'express';
import User from '../models/User';

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (role) query.role = role;

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
      res.json({ success: true, data: user });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (user) {
      res.json({ success: true, data: user });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) {
      res.json({ success: true, message: 'User deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const placesCount = await (await import('../models/Place')).default.countDocuments();
    const statesCount = await (await import('../models/State')).default.countDocuments();
    const citiesCount = await (await import('../models/City')).default.countDocuments();
    const hotelsCount = await (await import('../models/Hotel')).default.countDocuments();
    const restaurantsCount = await (await import('../models/Restaurant')).default.countDocuments();
    const usersCount = await User.countDocuments();
    const publishedPlaces = await (await import('../models/Place')).default.countDocuments({ published: true });

    res.json({
      success: true,
      data: {
        places: placesCount,
        states: statesCount,
        cities: citiesCount,
        hotels: hotelsCount,
        restaurants: restaurantsCount,
        users: usersCount,
        publishedPlaces,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default { getAllUsers, getUserById, updateUserRole, deleteUser, getDashboardStats };
