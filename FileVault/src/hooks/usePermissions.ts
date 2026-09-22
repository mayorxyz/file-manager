// File: src/hooks/usePermissions.ts

import { useState, useCallback } from 'react';
import { checkStoragePermissions, requestStoragePermissions } from '@utils/permissions';

/**
 * Custom hook for managing storage permissions
 */
export const usePermissions = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Check current permission status
   */
  const checkPermissions = useCallback(async () => {
    try {
      const granted = await checkStoragePermissions();
      setHasPermission(granted);
      return granted;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check permissions');
      return false;
    }
  }, []);

  /**
   * Request permissions from user
   */
  const requestPermissions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const granted = await requestStoragePermissions();
      setHasPermission(granted);
      
      if (!granted) {
        setError('Storage permission was denied. Please enable it in app settings.');
      }
      
      return granted;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request permissions');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Initialize permissions check on mount
   */
  const initPermissions = useCallback(async () => {
    await checkPermissions();
  }, [checkPermissions]);

  return {
    hasPermission,
    isLoading,
    error,
    checkPermissions,
    requestPermissions,
    initPermissions,
  };
};
