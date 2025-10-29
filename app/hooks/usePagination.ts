import { useState, useCallback } from 'react';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

interface UsePaginationResult {
  currentPage: number;
  totalPages: number;
  cursors: Array<QueryDocumentSnapshot<DocumentData> | undefined>;
  hasMore: boolean;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setTotalPages: React.Dispatch<React.SetStateAction<number>>;
  setCursors: React.Dispatch<React.SetStateAction<Array<QueryDocumentSnapshot<DocumentData> | undefined>>>;
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>;
  resetPagination: () => void;
}

export function usePagination(): UsePaginationResult {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [cursors, setCursors] = useState<Array<QueryDocumentSnapshot<DocumentData> | undefined>>([undefined]);
  const [hasMore, setHasMore] = useState(true);

  const resetPagination = useCallback(() => {
    setCurrentPage(1);
    setCursors([undefined]);
    setHasMore(true);
  }, []);

  return {
    currentPage,
    totalPages,
    cursors,
    hasMore,
    setCurrentPage,
    setTotalPages,
    setCursors,
    setHasMore,
    resetPagination,
  };
}

