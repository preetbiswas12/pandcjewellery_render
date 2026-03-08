import { useState, useEffect } from 'react';
import { Star, Trash2, Edit2, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { 
  getProductRatings, 
  getUserRating, 
  createRating, 
  updateRating, 
  deleteRating,
  RatingData,
  RatingStatistics
} from '../services/ratings';

interface RatingComponentProps {
  productId: string;
  productName: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
}

export default function RatingComponent({
  productId,
  productName,
  userId,
  userName,
  userEmail,
}: RatingComponentProps) {
  const [ratings, setRatings] = useState<RatingData[]>([]);
  const [statistics, setStatistics] = useState<RatingStatistics | null>(null);
  const [userRating, setUserRating] = useState<RatingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: '',
  });

  // Fetch ratings on mount
  useEffect(() => {
    fetchRatings();
  }, [productId]);

  // Check if user has a rating
  useEffect(() => {
    if (userId && productId) {
      checkUserRating();
    }
  }, [userId, productId]);

  const fetchRatings = async () => {
    setIsLoading(true);
    const result = await getProductRatings(productId);
    if (result.success) {
      setRatings(result.data.ratings);
      setStatistics(result.data.statistics);
    }
    setIsLoading(false);
  };

  const checkUserRating = async () => {
    if (!userId) return;
    const result = await getUserRating(productId, userId);
    if (result.success && result.data) {
      setUserRating(result.data);
      setFormData({
        rating: result.data.rating,
        title: result.data.title || '',
        comment: result.data.comment || '',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!userId || !userName || !userEmail) {
      setError('You must be logged in to rate this product');
      setIsSubmitting(false);
      return;
    }

    if (formData.rating < 1 || formData.rating > 5) {
      setError('Please select a valid rating');
      setIsSubmitting(false);
      return;
    }

    try {
      const ratingData: RatingData = {
        productId,
        userId,
        userName,
        userEmail,
        rating: formData.rating,
        title: formData.title,
        comment: formData.comment,
      };

      let result;
      if (userRating && editingId) {
        // Update existing rating
        result = await updateRating(editingId, userId, ratingData);
      } else {
        // Create new rating
        result = await createRating(ratingData);
      }

      if (result.success) {
        await fetchRatings();
        await checkUserRating();
        setShowForm(false);
        setEditingId(null);
        setFormData({ rating: 5, title: '', comment: '' });
      } else {
        setError(result.message || 'Failed to save rating');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!userRating || !userId) return;

    if (!window.confirm('Are you sure you want to delete your rating?')) {
      return;
    }

    setIsSubmitting(true);
    const result = await deleteRating(userRating._id!, userId);
    if (result.success) {
      await fetchRatings();
      setUserRating(null);
      setShowForm(false);
      setEditingId(null);
      setFormData({ rating: 5, title: '', comment: '' });
    } else {
      setError(result.message || 'Failed to delete rating');
    }
    setIsSubmitting(false);
  };

  const handleEdit = () => {
    setEditingId(userRating?._id || null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ rating: 5, title: '', comment: '' });
    setError('');
  };

  const renderStars = (count: number, interactive = false, onChange?: (val: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && onChange?.(star)}
            disabled={!interactive}
            className={`transition-all ${interactive ? 'cursor-pointer hover:scale-110' : ''}`}
          >
            <Star
              size={interactive ? 24 : 16}
              className={star <= count ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
            />
          </button>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="animate-spin" size={30} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      {statistics && (
        <div className="bg-gray-50 rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Average Rating */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="text-5xl font-bold mb-2">{statistics.averageRating}</div>
              <div className="flex gap-1 justify-center mb-2">
                {renderStars(Math.round(statistics.averageRating))}
              </div>
              <div className="text-sm opacity-70">{statistics.totalRatings} reviews</div>
            </div>

            {/* Rating Distribution */}
            <div className="md:col-span-2 space-y-3">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-12">
                    {renderStars(star)}
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 transition-all"
                      style={{
                        width: `${statistics.percentages[star as keyof typeof statistics.percentages]}%`,
                      }}
                    />
                  </div>
                  <div className="w-12 text-right text-sm text-gray-600">
                    {statistics.percentages[star as keyof typeof statistics.percentages]}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* User's Rating Section */}
      {userId && (
        <div className="border rounded-2xl p-8">
          <h3 className="text-xl font-semibold mb-6">
            {userRating ? 'Your Rating' : 'Share Your Rating'}
          </h3>

          {userRating && !showForm && (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex gap-2 items-center mb-2">
                    {renderStars(userRating.rating)}
                    <span className="text-sm font-medium text-gray-600 ml-2">
                      {new Date(userRating.createdAt || '').toLocaleDateString()}
                    </span>
                  </div>
                  {userRating.title && (
                    <h4 className="font-medium text-lg mb-2">{userRating.title}</h4>
                  )}
                  {userRating.comment && (
                    <p className="text-gray-700 mb-2">{userRating.comment}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleEdit}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                    title="Edit rating"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                    title="Delete rating"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {!userRating && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-all"
            >
              Rate This Product
            </button>
          )}

          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Rating *</label>
                <div className="flex gap-2">
                  {renderStars(formData.rating, true, (val) =>
                    setFormData((prev) => ({ ...prev, rating: val }))
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Title (Optional)</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Summarize your experience..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Review (Optional)</label>
                <textarea
                  value={formData.comment}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, comment: e.target.value }))
                  }
                  placeholder="Share your detailed thoughts about this fabric..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Saving...
                    </>
                  ) : editingId ? (
                    'Update Rating'
                  ) : (
                    'Submit Rating'
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {!userId && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
          <p className="text-blue-900">
            Sign in to share your rating and help other customers!
          </p>
        </div>
      )}

      {/* All Ratings */}
      <div>
        <h3 className="text-xl font-semibold mb-6">
          {ratings.length > 0 ? `Customer Reviews (${ratings.length})` : 'No reviews yet'}
        </h3>

        <div className="space-y-4">
          {ratings.map((rating) => (
            <div key={rating._id} className="border rounded-lg p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex gap-2 items-center mb-2">
                    {renderStars(rating.rating)}
                    <span className="text-sm text-gray-600">
                      {new Date(rating.createdAt || '').toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-600">{rating.userName}</p>
                </div>
              </div>

              {rating.title && <h4 className="font-medium text-base mb-2">{rating.title}</h4>}
              {rating.comment && (
                <p className="text-gray-700 mb-4 text-sm">{rating.comment}</p>
              )}

              {/* Helpful/Unhelpful buttons */}
              <div className="flex gap-4 text-sm">
                <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                  <ThumbsUp size={14} />
                  <span>Helpful ({rating.helpful || 0})</span>
                </button>
                <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                  <ThumbsDown size={14} />
                  <span>Not Helpful ({rating.unhelpful || 0})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
