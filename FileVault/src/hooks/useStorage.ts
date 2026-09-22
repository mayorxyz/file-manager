// File: src/hooks/useStorage.ts

import { useState, useEffect, useCallback } from 'react';
import { getStorageInfo } from '@services/storageService';
import { StorageInfo } from '@types/index';

/**
 * Custom hook for storage statistics
 */
export const useStorage = () => {
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load storage information
   */
  const loadStorageInfo = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const info = await getStorageInfo();
      setStorageInfo(info);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load storage info');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Auto-load on mount
   */
  useEffect(() => {
    loadStorageInfo();
  }, [loadStorageInfo]);

  return {
    storageInfo,
    isLoading,
    error,
    refresh: loadStorageInfo,
  };
};
