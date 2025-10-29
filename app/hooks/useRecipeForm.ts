import { useState, useCallback } from 'react';
import { RecipeCategory } from '../types';

interface RecipeFormState {
  title: string;
  description: string;
  introduction: string;
  category: RecipeCategory;
  cuisine: string;
  prepTime: number;
  rating: number;
  ingredients: string[];
  instructions: string[];
  image: File | null;
  existingImageUrl?: string;
}

const initialFormState: Omit<RecipeFormState, 'existingImageUrl'> = {
  title: '',
  description: '',
  introduction: '',
  category: '' as RecipeCategory,
  cuisine: '',
  prepTime: 0,
  rating: 0,
  ingredients: [''],
  instructions: [''],
  image: null,
};

export function useRecipeForm(initialState?: Partial<RecipeFormState>) {
  const [formData, setFormData] = useState<RecipeFormState>({
    ...initialFormState,
    existingImageUrl: initialState?.existingImageUrl || '',
    ...initialState,
  });

  const resetForm = useCallback(() => {
    setFormData({
      ...initialFormState,
      existingImageUrl: initialState?.existingImageUrl || '',
    });
  }, [initialState?.existingImageUrl]);

  const updateFormData = useCallback((updates: Partial<RecipeFormState>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      let processedValue: string | number = value;

      if (name === 'prepTime' || name === 'rating') {
        processedValue = Number(value);
        if (name === 'rating') {
          if (processedValue > 5) processedValue = 5;
          if (processedValue < 0) processedValue = 0;
        }
      }

      setFormData(prev => ({
        ...prev,
        [name]: processedValue,
      }));
    },
    []
  );

  const handleIngredientChange = useCallback((index: number, value: string) => {
    setFormData(prev => {
      const newIngredients = [...prev.ingredients];
      newIngredients[index] = value;
      return { ...prev, ingredients: newIngredients };
    });
  }, []);

  const addIngredient = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, ''],
    }));
  }, []);

  const removeIngredient = useCallback((index: number) => {
    setFormData(prev => {
      if (prev.ingredients.length > 1) {
        return {
          ...prev,
          ingredients: prev.ingredients.filter((_, i) => i !== index),
        };
      }
      return prev;
    });
  }, []);

  const handleInstructionChange = useCallback(
    (index: number, value: string) => {
      setFormData(prev => {
        const newInstructions = [...prev.instructions];
        newInstructions[index] = value;
        return { ...prev, instructions: newInstructions };
      });
    },
    []
  );

  const addInstruction = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, ''],
    }));
  }, []);

  const removeInstruction = useCallback((index: number) => {
    setFormData(prev => {
      if (prev.instructions.length > 1) {
        return {
          ...prev,
          instructions: prev.instructions.filter((_, i) => i !== index),
        };
      }
      return prev;
    });
  }, []);

  const handleImageSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setFormData(prev => ({ ...prev, image: file }));
      }
    },
    []
  );

  return {
    formData,
    resetForm,
    updateFormData,
    handleInputChange,
    handleIngredientChange,
    addIngredient,
    removeIngredient,
    handleInstructionChange,
    addInstruction,
    removeInstruction,
    handleImageSelect,
  };
}
