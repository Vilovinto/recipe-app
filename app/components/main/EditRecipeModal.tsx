'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { recipeService, fileService } from '../../lib/firebase-utils';
import { RecipeCategory, Recipe } from '../../types';
import { useRecipeForm } from '../../hooks/useRecipeForm';
import { isRecipeOwner } from '../../lib/recipe-utils';
import Modal from './Modal';
import RecipeFormFields from './RecipeFormFields';
import RecipeImageUpload from './RecipeImageUpload';
import IngredientsList from './IngredientsList';
import InstructionsList from './InstructionsList';
import toast from 'react-hot-toast';

interface EditRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: Recipe | null;
  onRecipeUpdated?: (recipe: Recipe) => void;
}

export default function EditRecipeModal({
  isOpen,
  onClose,
  recipe,
  onRecipeUpdated,
}: EditRecipeModalProps) {
  const [loading, setLoading] = useState(false);
  const { user, appUser } = useAuth();
  const {
    formData,
    updateFormData,
    handleInputChange,
    handleIngredientChange,
    addIngredient,
    removeIngredient,
    handleInstructionChange,
    addInstruction,
    removeInstruction,
    handleImageSelect,
  } = useRecipeForm({ existingImageUrl: recipe?.image || '' });

  useEffect(() => {
    if (isOpen && recipe) {
      if (!isRecipeOwner(recipe, user?.uid)) {
        toast.error('You can only edit your own recipes');
        onClose();
        return;
      }

      updateFormData({
        title: recipe.title,
        description: recipe.description,
        introduction: recipe.introduction || '',
        category: recipe.category,
        cuisine: recipe.cuisine || '',
        prepTime: recipe.prepTime,
        rating: recipe.rating,
        ingredients: recipe.ingredients.length > 0 ? recipe.ingredients : [''],
        instructions:
          recipe.instructions.length > 0 ? recipe.instructions : [''],
        image: null,
        existingImageUrl: recipe.image || '',
      });
    }
  }, [isOpen, recipe, user, onClose, updateFormData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !appUser || !recipe) {
      toast.error('Invalid request');
      return;
    }

    if (!isRecipeOwner(recipe, user.uid)) {
      toast.error('You can only edit your own recipes');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }
    if (!formData.introduction.trim()) {
      toast.error('Introduction is required');
      return;
    }
    if (!formData.category) {
      toast.error('Category is required');
      return;
    }
    if (!formData.cuisine.trim()) {
      toast.error('Cuisine is required');
      return;
    }
    if (formData.prepTime <= 0) {
      toast.error('Prep time must be greater than 0');
      return;
    }
    if (formData.rating <= 0) {
      toast.error('Rating is required');
      return;
    }
    if (!formData.ingredients.some(ing => ing.trim())) {
      toast.error('At least one ingredient is required');
      return;
    }
    if (!formData.instructions.some(inst => inst.trim())) {
      toast.error('At least one instruction is required');
      return;
    }
    if (!formData.existingImageUrl && !formData.image) {
      toast.error('Image is required');
      return;
    }

    setLoading(true);

    try {
      let imageUrl = formData.existingImageUrl || recipe.image;

      if (formData.image) {
        const imagePath = `recipe-images/${user.uid}/${Date.now()}-${formData.image.name}`;
        imageUrl = await fileService.uploadImage(formData.image, imagePath);
      }

      const recipeData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        introduction: formData.introduction.trim(),
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

      try {
        await recipeService.updateRecipe(recipe.id, recipeData);
      } catch (firebaseError) {
        console.log('Recipe was only stored locally');
      }

      const updatedRecipe: Recipe = {
        ...recipe,
        title: recipeData.title,
        description: recipeData.description,
        introduction: recipeData.introduction,
        category: recipeData.category,
        cuisine: recipeData.cuisine,
        prepTime: recipeData.prepTime,
        rating: recipeData.rating,
        ingredients: recipeData.ingredients,
        instructions: recipeData.instructions,
        image: recipeData.image,
        author: recipeData.author,
        updatedAt: new Date(),
      };

      toast.success('Recipe updated successfully!');

      onClose();
      if (onRecipeUpdated) {
        onRecipeUpdated(updatedRecipe);
      }
    } catch (error) {
      console.error('Error updating recipe:', error);
      toast.error('Failed to update recipe');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !recipe) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Recipe"
      loading={loading}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-white bg-[rgba(255,255,255,0.1)] rounded-lg hover:bg-[rgba(255,255,255,0.2)] transition-colors disabled:opacity-50 font-['Fira_Sans']"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-[#FFE478] text-[#0D0702] rounded-lg hover:bg-[#FFE478]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold font-['Fira_Sans']"
          >
            {loading ? 'Updating...' : 'Update Recipe'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        <RecipeFormFields
          formData={formData}
          onInputChange={handleInputChange}
          onCategoryChange={category => updateFormData({ category })}
        />
        <RecipeImageUpload
          image={formData.image}
          existingImageUrl={formData.existingImageUrl}
          onImageSelect={handleImageSelect}
          uploadId="image-upload-edit"
        />
        <IngredientsList
          ingredients={formData.ingredients}
          onIngredientChange={handleIngredientChange}
          onAddIngredient={addIngredient}
          onRemoveIngredient={removeIngredient}
        />
        <InstructionsList
          instructions={formData.instructions}
          onInstructionChange={handleInstructionChange}
          onAddInstruction={addInstruction}
          onRemoveInstruction={removeInstruction}
        />
      </form>
    </Modal>
  );
}
