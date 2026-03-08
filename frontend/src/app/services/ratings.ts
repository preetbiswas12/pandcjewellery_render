import { config } from '../config/env';

export interface RatingData {
  _id?: string;
  productId: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number;
  title?: string;
  comment?: string;
  helpful?: number;
  unhelpful?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface RatingStatistics {
  averageRating: number;
  totalRatings: number;
  ratingCounts: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  percentages: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

// Get all ratings for a product
export const getProductRatings = async (productId: string) => {
  try {
    const response = await fetch(`${config.api.url}/ratings/product/${productId}`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return { success: false, message: 'Failed to fetch ratings' };
  }
};

// Get user's rating for a product
export const getUserRating = async (productId: string, userId: string) => {
  try {
    const response = await fetch(`${config.api.url}/ratings/user/${productId}/${userId}`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching user rating:', error);
    return { success: false, message: 'Failed to fetch rating' };
  }
};

// Create a new rating
export const createRating = async (ratingData: RatingData) => {
  try {
    const response = await fetch(`${config.api.url}/ratings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ratingData),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating rating:', error);
    return { success: false, message: 'Failed to create rating' };
  }
};

// Update a rating
export const updateRating = async (ratingId: string, userId: string, updateData: Partial<RatingData>) => {
  try {
    const response = await fetch(`${config.api.url}/ratings/${ratingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, ...updateData }),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating rating:', error);
    return { success: false, message: 'Failed to update rating' };
  }
};

// Delete a rating
export const deleteRating = async (ratingId: string, userId: string) => {
  try {
    const response = await fetch(`${config.api.url}/ratings/${ratingId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error deleting rating:', error);
    return { success: false, message: 'Failed to delete rating' };
  }
};

// Mark rating as helpful
export const markRatingHelpful = async (ratingId: string, helpful: boolean) => {
  try {
    const response = await fetch(`${config.api.url}/ratings/${ratingId}/helpful`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ helpful }),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error marking rating:', error);
    return { success: false, message: 'Failed to mark rating' };
  }
};
