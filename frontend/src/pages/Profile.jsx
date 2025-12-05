import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, FileText, Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Profile Page
 * User profile management
 */
const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        bio: user?.bio || '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (formData.bio.length > 200) {
            newErrors.bio = 'Bio cannot exceed 200 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        const result = await updateProfile({
            name: formData.name.trim(),
            bio: formData.bio.trim(),
        });
        setIsLoading(false);

        if (result.success) {
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            bio: user?.bio || '',
        });
        setErrors({});
        setIsEditing(false);
    };

    // Format date
    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Link */}
                <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>

                {/* Profile Header */}
                <div className="card mb-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        {/* Avatar */}
                        <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-indigo-500/25">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center sm:text-left">
                            <h1 className="text-2xl font-bold text-white mb-1">{user?.name}</h1>
                            <p className="text-slate-400 flex items-center justify-center sm:justify-start gap-2">
                                <Mail className="w-4 h-4" />
                                {user?.email}
                            </p>
                            {user?.bio && (
                                <p className="text-slate-300 mt-3">{user.bio}</p>
                            )}
                            <p className="text-sm text-slate-500 mt-3">
                                Member since {formatDate(user?.createdAt)}
                            </p>
                        </div>

                        {/* Edit Button */}
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="btn-secondary"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                {/* Edit Form */}
                {isEditing && (
                    <div className="card animate-fade-in">
                        <h2 className="text-xl font-semibold text-white mb-6">Edit Profile</h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                                    <User className="w-4 h-4 inline mr-2" />
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your name"
                                    className={`input-field ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                                )}
                            </div>

                            {/* Email (Read-only) */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    <Mail className="w-4 h-4 inline mr-2" />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    disabled
                                    className="input-field opacity-50 cursor-not-allowed"
                                />
                                <p className="mt-1 text-xs text-slate-500">Email cannot be changed</p>
                            </div>

                            {/* Bio */}
                            <div>
                                <label htmlFor="bio" className="block text-sm font-medium text-slate-300 mb-2">
                                    <FileText className="w-4 h-4 inline mr-2" />
                                    Bio
                                </label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    maxLength={200}
                                    rows={3}
                                    placeholder="Tell us about yourself..."
                                    className={`input-field resize-none ${errors.bio ? 'border-red-500 focus:ring-red-500' : ''}`}
                                />
                                <div className="flex justify-between mt-1">
                                    {errors.bio ? (
                                        <p className="text-sm text-red-400">{errors.bio}</p>
                                    ) : (
                                        <span></span>
                                    )}
                                    <p className="text-xs text-slate-500">{formData.bio.length}/200</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-slate-700">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="btn-secondary flex-1"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="loading-spinner w-4 h-4"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Account Info Card */}
                {!isEditing && (
                    <div className="card">
                        <h2 className="text-xl font-semibold text-white mb-6">Account Information</h2>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-slate-700">
                                <span className="text-slate-400">Account Status</span>
                                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium">
                                    Active
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-slate-700">
                                <span className="text-slate-400">Member Since</span>
                                <span className="text-white">{formatDate(user?.createdAt)}</span>
                            </div>
                            <div className="flex justify-between items-center py-3">
                                <span className="text-slate-400">Last Updated</span>
                                <span className="text-white">{formatDate(user?.updatedAt)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
