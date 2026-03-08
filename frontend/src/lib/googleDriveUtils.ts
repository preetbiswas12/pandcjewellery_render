/**
 * Convert Google Drive share links to direct image URLs
 * From: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * To: https://lh3.googleusercontent.com/d/FILE_ID or https://drive.google.com/uc?export=view&id=FILE_ID
 */
export const convertGoogleDriveLink = (url: string): string => {
  if (!url) return url;
  
  // Check if it's a Google Drive link
  if (!url.includes('drive.google.com')) {
    return url;
  }

  // Extract file ID from various Google Drive URL formats
  let fileId = '';

  // Format 1: https://drive.google.com/file/d/FILE_ID/view?usp=...
  const match1 = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
  if (match1) {
    fileId = match1[1];
  }

  // Format 2: https://drive.google.com/open?id=FILE_ID
  const match2 = url.match(/id=([a-zA-Z0-9-_]+)/);
  if (!fileId && match2) {
    fileId = match2[1];
  }

  // If we found a file ID, convert to direct view URL
  // Use GoogleUserContent (lh3) for better reliability with shared files
  if (fileId) {
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  return url;
};

/**
 * Extract Google Drive file ID from URL
 */
export const extractGoogleDriveFileId = (url: string): string | null => {
  if (!url || !url.includes('drive.google.com')) {
    return null;
  }

  // Format 1: https://drive.google.com/file/d/FILE_ID/view?usp=...
  const match1 = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
  if (match1) {
    return match1[1];
  }

  // Format 2: https://drive.google.com/open?id=FILE_ID
  const match2 = url.match(/id=([a-zA-Z0-9-_]+)/);
  if (match2) {
    return match2[1];
  }

  return null;
};

/**
 * Check if URL is a Google Drive URL
 */
export const isGoogleDriveUrl = (url: string): boolean => {
  return url.includes('drive.google.com');
};

/**
 * Load Google Drive Picker API
 */
export const loadGoogleDrivePickerAPI = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if ((window as any).gapi?.load) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      (window as any).gapi.load('picker', { callback: () => resolve() });
    };
    
    script.onerror = () => {
      reject(new Error('Failed to load Google Drive Picker API'));
    };

    document.head.appendChild(script);
  });
};

/**
 * Open Google Drive Picker to select images
 */
export const openGoogleDrivePicker = async (
  accessToken: string,
  onSelect: (fileId: string, fileName: string, url: string) => void
): Promise<void> => {
  try {
    await loadGoogleDrivePickerAPI();

    const picker = new (window as any).google.picker.PickerBuilder()
      .addView(new (window as any).google.picker.View((window as any).google.picker.ViewId.DOCS_IMAGES))
      .setOAuthToken(accessToken)
      .setCallback((data: any) => {
        if (data.action === (window as any).google.picker.Action.PICKED_EXTERNAL) {
          console.log('You can control+click to open multiple files.');
        } else if (data.action === (window as any).google.picker.Action.PICKED) {
          const fileId = data.docs[0].id;
          const fileName = data.docs[0].name;
          const directUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
          onSelect(fileId, fileName, directUrl);
        }
      })
      .build();

    picker.setVisible(true);
  } catch (error) {
    console.error('Error opening Google Drive Picker:', error);
    throw error;
  }
};
