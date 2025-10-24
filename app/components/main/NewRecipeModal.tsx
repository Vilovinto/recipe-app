'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { recipeService, fileService } from '../../lib/firebase-utils';
import { RecipeCategory, Recipe } from '../../types';
import toast from 'react-hot-toast';

interface NewRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecipeCreated?: (recipe: Recipe) => void;
}

export default function NewRecipeModal({
  isOpen,
  onClose,
  onRecipeCreated,
}: NewRecipeModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as RecipeCategory,
    cuisine: '',
    prepTime: 0,
    rating: 0,
    ingredients: [''],
    instructions: [''],
    image: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const { user, appUser } = useAuth();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        description: '',
        category: '' as RecipeCategory,
        cuisine: '',
        prepTime: 0,
        rating: 0,
        ingredients: [''],
        instructions: [''],
        image: null,
      });
    }
  }, [isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    let processedValue: string | number = value;
    
    if (name === 'prepTime' || name === 'rating') {
      processedValue = Number(value);
      
      // Обмеження для рейтингу: максимум 5
      if (name === 'rating' && processedValue > 5) {
        processedValue = 5;
      }
      
      // Обмеження для рейтингу: мінімум 0
      if (name === 'rating' && processedValue < 0) {
        processedValue = 0;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const addIngredient = () => {
    setFormData(prev => ({ ...prev, ingredients: [...prev.ingredients, ''] }));
  };

  const removeIngredient = (index: number) => {
    if (formData.ingredients.length > 1) {
      const newIngredients = formData.ingredients.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, ingredients: newIngredients }));
    }
  };

  const handleInstructionChange = (index: number, value: string) => {
    const newInstructions = [...formData.instructions];
    newInstructions[index] = value;
    setFormData(prev => ({ ...prev, instructions: newInstructions }));
  };

  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, ''],
    }));
  };

  const removeInstruction = (index: number) => {
    if (formData.instructions.length > 1) {
      const newInstructions = formData.instructions.filter(
        (_, i) => i !== index
      );
      setFormData(prev => ({ ...prev, instructions: newInstructions }));
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !appUser) {
      toast.error('You must be logged in to create a recipe');
      return;
    }

    // Validation
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }
    if (!formData.category) {
      toast.error('Category is required');
      return;
    }
    if (formData.prepTime <= 0) {
      toast.error('Prep time must be greater than 0');
      return;
    }

    setLoading(true);

    try {
      let imageUrl = '';

      // Upload image if provided
      if (formData.image) {
        const imagePath = `recipe-images/${user.uid}/${Date.now()}-${formData.image.name}`;
        imageUrl = await fileService.uploadImage(formData.image, imagePath);
      }

      // Create recipe
      const recipeData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        cuisine: formData.cuisine.trim(),
        prepTime: formData.prepTime,
        rating: formData.rating,
        ingredients: formData.ingredients.filter(ing => ing.trim()),
        instructions: formData.instructions.filter(inst => inst.trim()),
        image: imageUrl,
        author: `${appUser.firstName} ${appUser.lastName}`,
        userId: user.uid,
      };

      // Спробуємо створити в Firebase
      let recipeId = `local-${Date.now()}`;
      try {
        recipeId = await recipeService.createRecipe(recipeData);
      } catch (firebaseError) {
        // Якщо Firebase недоступний, створюємо локальний ID
        console.log('Recipe will be stored locally only');
      }
      
      // Create the recipe object to pass to parent
      const newRecipe: Recipe = {
        id: recipeId,
        title: recipeData.title,
        description: recipeData.description,
        category: recipeData.category,
        cuisine: recipeData.cuisine,
        prepTime: recipeData.prepTime,
        rating: recipeData.rating,
        ingredients: recipeData.ingredients,
        instructions: recipeData.instructions,
        image: recipeData.image,
        author: recipeData.author,
        userId: recipeData.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      toast.success('Recipe created successfully!');

      // Close modal and notify parent
      onClose();
      if (onRecipeCreated) {
        onRecipeCreated(newRecipe);
      }
    } catch (error) {
      console.error('Error creating recipe:', error);
      toast.error('Failed to create recipe');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-[#0D0702] rounded-2xl shadow-xl border border-[rgba(230,221,214,0.3)]">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[rgba(230,221,214,0.2)]">
            <h2 className="text-2xl font-bold text-white font-['Fira_Sans']">
              Create New Recipe
            </h2>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-[#E6D8D6] hover:text-white transition-colors disabled:opacity-50"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[80vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              {/* Basic Information */}
              <div className="bg-[rgba(255,255,255,0.1)] rounded-xl p-6 border border-[rgba(230,221,214,0.2)]">
                <h3 className="text-xl font-semibold text-white mb-6 font-['Fira_Sans']">
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2 font-['Fira_Sans']">
                      Recipe Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-[rgba(230,221,214,0.5)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE478] focus:border-transparent bg-[rgba(255,255,255,0.1)] text-white placeholder-gray-300"
                      placeholder="e.g., Lemon Drizzle Cake"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2 font-['Fira_Sans']">
                      Category *
                    </label>
                    <select
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-[rgba(230,221,214,0.5)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE478] focus:border-transparent bg-[rgba(255,255,255,0.1)] text-white placeholder-gray-300"
                    >
                      <option value="">Select Category</option>
                      <option value="dessert">Dessert</option>
                      <option value="main">Main Course</option>
                      <option value="snack">Snack</option>
                      <option value="breakfast">Breakfast</option>
                      <option value="vegan">Vegan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2 font-['Fira_Sans']">
                      Cuisine
                    </label>
                    <input
                      type="text"
                      name="cuisine"
                      value={formData.cuisine}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-[rgba(230,221,214,0.5)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE478] focus:border-transparent bg-[rgba(255,255,255,0.1)] text-white placeholder-gray-300"
                      placeholder="e.g., British, Italian, Mexican"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2 font-['Fira_Sans']">
                      Prep Time (minutes) *
                    </label>
                    <input
                      type="number"
                      name="prepTime"
                      required
                      min="1"
                      value={formData.prepTime === 0 ? '' : formData.prepTime}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-[rgba(230,221,214,0.5)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE478] focus:border-transparent bg-[rgba(255,255,255,0.1)] text-white placeholder-gray-300"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2 font-['Fira_Sans']">
                      Rating
                    </label>
                    <input
                      type="number"
                      name="rating"
                      min="0"
                      max="5"
                      step="0.1"
                      value={formData.rating === 0 ? '' : formData.rating}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-[rgba(230,221,214,0.5)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE478] focus:border-transparent bg-[rgba(255,255,255,0.1)] text-white placeholder-gray-300"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-[#0D0702] mb-2 font-['Fira_Sans']">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-[rgba(230,221,214,0.5)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE478] focus:border-transparent bg-[rgba(255,255,255,0.1)] text-white placeholder-gray-300"
                    placeholder="Describe your recipe..."
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="bg-[rgba(255,255,255,0.1)] rounded-xl p-6 border border-[rgba(230,221,214,0.2)]">
                <h3 className="text-xl font-semibold text-white mb-6 font-['Fira_Sans']">
                  Recipe Image
                </h3>
                <div className="border-2 border-dashed border-[rgba(230,221,214,0.5)] rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <svg
                      className="w-12 h-12 text-[#E6D8D6] mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-white font-['Fira_Sans']">
                      {formData.image
                        ? formData.image.name
                        : 'Click to upload an image'}
                    </p>
                  </label>
                </div>
              </div>

              {/* Ingredients */}
              <div className="bg-[rgba(255,255,255,0.1)] rounded-xl p-6 border border-[rgba(230,221,214,0.2)]">
                <h3 className="text-xl font-semibold text-white mb-6 font-['Fira_Sans']">
                  Ingredients
                </h3>

                <div className="space-y-4">
                  {formData.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <input
                        type="text"
                        value={ingredient}
                        onChange={e =>
                          handleIngredientChange(index, e.target.value)
                        }
                        className="flex-1 px-3 py-2 border border-[rgba(230,221,214,0.5)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE478] focus:border-transparent bg-[rgba(255,255,255,0.1)] text-white placeholder-gray-300"
                        placeholder={`Ingredient ${index + 1}`}
                      />
                      {formData.ingredients.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeIngredient(index)}
                          className="text-red-600 hover:text-red-700 font-['Fira_Sans']"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addIngredient}
                    className="w-full py-2 border-2 border-dashed border-[rgba(230,221,214,0.5)] rounded-lg text-white hover:text-white/80 hover:border-[rgba(230,221,214,0.8)] font-['Fira_Sans']"
                  >
                    + Add Ingredient
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-[rgba(255,255,255,0.1)] rounded-xl p-6 border border-[rgba(230,221,214,0.2)]">
                <h3 className="text-xl font-semibold text-white mb-6 font-['Fira_Sans']">
                  Instructions
                </h3>

                <div className="space-y-4">
                  {formData.instructions.map((instruction, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <span className="shrink-0 w-8 h-8 bg-[#FFE478] text-[#0D0702] rounded-full flex items-center justify-center text-sm font-semibold font-['Fira_Sans']">
                        {index + 1}
                      </span>
                      <textarea
                        value={instruction}
                        onChange={e =>
                          handleInstructionChange(index, e.target.value)
                        }
                        className="flex-1 px-3 py-2 border border-[rgba(230,221,214,0.5)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFE478] focus:border-transparent bg-[rgba(255,255,255,0.1)] text-white placeholder-gray-300"
                        rows={3}
                        placeholder={`Step ${index + 1}...`}
                      />
                      {formData.instructions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeInstruction(index)}
                          className="text-red-600 hover:text-red-700 font-['Fira_Sans']"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addInstruction}
                    className="w-full py-2 border-2 border-dashed border-[rgba(230,221,214,0.5)] rounded-lg text-white hover:text-white/80 hover:border-[rgba(230,221,214,0.8)] font-['Fira_Sans']"
                  >
                    + Add Step
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-4 p-6 border-t border-[rgba(230,221,214,0.2)]">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-white bg-[rgba(255,255,255,0.1)] rounded-lg hover:bg-[rgba(255,255,255,0.2)] transition-colors disabled:opacity-50 font-['Fira_Sans']"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="recipe-form"
              disabled={loading}
              onClick={handleSubmit}
              className="px-6 py-2 bg-[#FFE478] text-[#0D0702] rounded-lg hover:bg-[#FFE478]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold font-['Fira_Sans']"
            >
              {loading ? 'Creating...' : 'Create Recipe'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
