import { useState, useCallback } from 'react';
import { RecipeCategory, PrepTimeFilter, RecipeFilters } from '../types';
import { parseHoursToMinutes } from '../lib/recipe-utils';

interface UseFiltersResult {
  selectedCategories: string[];
  prepTimeFilter: string;
  customMinTime: string;
  customMaxTime: string;
  cuisineFilter: string;
  difficultyFilter: string;
  topPrepTimeFilter: string;
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  setPrepTimeFilter: React.Dispatch<React.SetStateAction<string>>;
  setCustomMinTime: React.Dispatch<React.SetStateAction<string>>;
  setCustomMaxTime: React.Dispatch<React.SetStateAction<string>>;
  setCuisineFilter: React.Dispatch<React.SetStateAction<string>>;
  setDifficultyFilter: React.Dispatch<React.SetStateAction<string>>;
  setTopPrepTimeFilter: React.Dispatch<React.SetStateAction<string>>;
  getFirestoreFilters: () => RecipeFilters;
  handleCategoryChange: (category: string, checked: boolean) => void;
  handlePrepTimeChange: (time: string) => void;
}

export function useFilters(): UseFiltersResult {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [prepTimeFilter, setPrepTimeFilter] = useState('');
  const [customMinTime, setCustomMinTime] = useState('');
  const [customMaxTime, setCustomMaxTime] = useState('');
  const [cuisineFilter, setCuisineFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [topPrepTimeFilter, setTopPrepTimeFilter] = useState('');

  const getFirestoreFilters = useCallback((): RecipeFilters => {
    const filters: RecipeFilters = {};

    if (selectedCategories.length > 0) {
      const categoryMap: Record<string, RecipeCategory> = {
        Vegan: 'vegan',
        Dessert: 'dessert',
        Italian: 'main',
        Breakfast: 'breakfast',
        Mexican: 'main',
        Asian: 'main',
      };
      filters.category =
        categoryMap[selectedCategories[0]] ||
        (selectedCategories[0].toLowerCase() as RecipeCategory);
    }

    const activePrepTimeFilter = topPrepTimeFilter || prepTimeFilter;
    if (activePrepTimeFilter && activePrepTimeFilter !== 'Custom') {
      if (activePrepTimeFilter === 'Under 15 mins') {
        filters.prepTime = '<15';
      } else if (activePrepTimeFilter === '15-30 mins') {
        filters.customPrepTime = {
          min: 15,
          max: 30,
        };
      } else if (activePrepTimeFilter === '30-60 mins') {
        filters.customPrepTime = {
          min: 30,
          max: 60,
        };
      } else if (
        activePrepTimeFilter === 'Over 1 hr' ||
        activePrepTimeFilter === 'Over 1 hour'
      ) {
        filters.prepTime = '>60';
      }
    }

    if (cuisineFilter) {
      filters.cuisine = cuisineFilter;
    }

    if (difficultyFilter) {
      filters.difficulty = difficultyFilter;
    }

    if (activePrepTimeFilter === 'Custom') {
      const minTimeMinutes = customMinTime
        ? parseHoursToMinutes(customMinTime)
        : null;
      const maxTimeMinutes = customMaxTime
        ? parseHoursToMinutes(customMaxTime)
        : null;
      filters.customPrepTime = {
        min: minTimeMinutes !== null ? minTimeMinutes : undefined,
        max: maxTimeMinutes !== null ? maxTimeMinutes : undefined,
      };
    }

    return filters;
  }, [
    selectedCategories,
    prepTimeFilter,
    topPrepTimeFilter,
    cuisineFilter,
    difficultyFilter,
    customMinTime,
    customMaxTime,
  ]);

  const handleCategoryChange = useCallback(
    (category: string, checked: boolean) => {
      if (checked) {
        setSelectedCategories(prev => [...prev, category]);
      } else {
        setSelectedCategories(prev => prev.filter(c => c !== category));
      }
    },
    []
  );

  const handlePrepTimeChange = useCallback(
    (time: string) => {
      if (time === prepTimeFilter) {
        setPrepTimeFilter('');
        setCustomMinTime('');
        setCustomMaxTime('');
      } else {
        setPrepTimeFilter(time);
        setTopPrepTimeFilter('');
        if (time !== 'Custom') {
          setCustomMinTime('');
          setCustomMaxTime('');
        }
      }
    },
    [prepTimeFilter]
  );

  return {
    selectedCategories,
    prepTimeFilter,
    customMinTime,
    customMaxTime,
    cuisineFilter,
    difficultyFilter,
    topPrepTimeFilter,
    setSelectedCategories,
    setPrepTimeFilter,
    setCustomMinTime,
    setCustomMaxTime,
    setCuisineFilter,
    setDifficultyFilter,
    setTopPrepTimeFilter,
    getFirestoreFilters,
    handleCategoryChange,
    handlePrepTimeChange,
  };
}
