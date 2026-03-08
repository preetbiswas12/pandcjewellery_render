import { useState } from 'react';
import { Cloud, Plus, AlertCircle } from 'lucide-react';
import { convertGoogleDriveLink } from '../../lib/googleDriveUtils';

interface GoogleDrivePickerProps {
  onSelect: (urls: string[]) => void;
  multiple?: boolean;
  disabled?: boolean;
}

export const GoogleDrivePicker = ({ onSelect, multiple = true, disabled = false }: GoogleDrivePickerProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputUrl, setInputUrl] = useState('');
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  const handlePasteGoogleDriveUrl = () => {
    if (!inputUrl.trim()) {
      setError('Please enter a Google Drive link');
      return;
    }

    try {
      // Validate it's a Google Drive link first
      if (!inputUrl.includes('drive.google.com')) {
        setError('Please enter a valid Google Drive link (must be from drive.google.com)');
        return;
      }

      // Convert the Google Drive URL to direct view URL
      const directUrl = convertGoogleDriveLink(inputUrl);
      
      // Verify conversion worked (should contain the file ID in the new format)
      if (!directUrl || directUrl === inputUrl) {
        setError('Could not extract file ID from Google Drive link. Make sure the URL is in the correct format.');
        return;
      }

      setSelectedUrl(directUrl);
      setError(null);

      // If single mode, immediately call onSelect
      if (!multiple) {
        onSelect([directUrl]);
        setInputUrl('');
        setSelectedUrl(null);
      }
    } catch (err) {
      setError('Failed to process Google Drive link: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleAddUrl = () => {
    if (selectedUrl) {
      onSelect([selectedUrl]);
      setInputUrl('');
      setSelectedUrl(null);
    }
  };

  const handleUseGooglePicker = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check if Google API is available
      if (!(window as any).gapi) {
        // Fallback: Show instructions for manual URL input
        setError('Google Picker API not loaded. Please paste your Google Drive image link instead.');
        setLoading(false);
        return;
      }

      // For better UX, we'll use the URL paste method as primary
      // since it requires less setup than full OAuth
      setError('Paste your Google Drive image sharing link above (Ctrl+V)');
      setLoading(false);
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-dashed border-blue-300">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Cloud className="text-blue-600" size={20} />
        <h3 className="font-semibold text-blue-900">Google Drive Images</h3>
      </div>

      {/* Instructions */}
      <div className="text-sm text-blue-800 space-y-1">
        <p>✓ Open your image in Google Drive</p>
        <p>✓ Click "Share" button → Copy the sharing link</p>
        <p>✓ Make sure sharing is set to "Viewer" or "Anyone with the link"</p>
        <p>✓ Paste the link below and click "Convert Link"</p>
      </div>

      {/* URL Input */}
      <div className="space-y-2">
        <input
          type="text"
          value={inputUrl}
          onChange={(e) => {
            setInputUrl(e.target.value);
            setError(null);
          }}
          onPaste={() => setTimeout(handlePasteGoogleDriveUrl, 0)}
          placeholder="Paste Google Drive sharing link here..."
          className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          disabled={disabled || loading}
        />
        
        {/* Preview if URL added */}
        {selectedUrl && (
          <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-200 border-2 border-blue-400">
            <img 
              src={selectedUrl} 
              alt="Preview" 
              className="w-full h-full object-cover"
              onError={() => setError('Failed to load image. Make sure sharing is enabled and the file ID is correct.')}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handlePasteGoogleDriveUrl}
            disabled={disabled || loading || !inputUrl.trim()}
            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
          >
            Convert Link
          </button>
          {selectedUrl && (
            <button
              onClick={handleAddUrl}
              disabled={disabled || loading}
              className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium flex items-center justify-center gap-1"
            >
              <Plus size={16} />
              Add Image
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex gap-2 bg-red-50 border border-red-300 rounded-lg p-2 text-red-700 text-sm">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Info Box */}
      <div className="text-xs text-blue-700 bg-blue-50 p-2 rounded border border-blue-200">
        <strong>Tip:</strong> Google Drive images load directly from their servers, so no separate hosting needed!
      </div>
    </div>
  );
};
