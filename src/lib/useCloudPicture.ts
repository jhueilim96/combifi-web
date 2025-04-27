'use client';

import { useState, useEffect } from 'react';

export function useCloudPicture(filename: string): string {
  const [imageUrl, setImageUrl] = useState<string>('');
  
  useEffect(() => {
    let objectUrl = '';
    
    const fetchImage = async () => {
      if (!filename) return;
      
      try {
        const response = await fetch(`/api/picture?filename=${filename}`);
        if (!response.ok) throw new Error('Failed to fetch image');
        
        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        setImageUrl(objectUrl);
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };
    
    fetchImage();
    
    // Clean up object URL on unmount
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [filename]);
  
  return imageUrl;
}
