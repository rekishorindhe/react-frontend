import React, { useState } from 'react';

interface PDFBinaryDownloaderProps {
  s3FileUrl: string; // Full S3 URL, e.g., 'https://refurbedge-prod.s3.us-east-1.amazonaws.com/uat/auctionAppEwayBill/2025/08/MBILL38122025.pdf'
  fileName?: string; // Optional custom filename for download, defaults to extracted from URL
  proxyBase?: string; // Optional: '/api/proxy' for Vite proxy or full backend proxy URL
}

const PDFBinaryDownloader: React.FC<PDFBinaryDownloaderProps> = ({
  s3FileUrl,
  fileName,
  proxyBase = '/api/proxy', // Default to Vite proxy path
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Extract filename from URL if not provided
  const getFileName = (): string => {
    if (fileName) return fileName;
    try {
      const url = new URL(s3FileUrl);
      return url.pathname.split('/').pop() || 'downloaded-file.pdf';
    } catch {
      return 'downloaded-file.pdf';
    }
  };

  // Construct proxy URL dynamically
  const getProxyUrl = (): string => {
    try {
      const url = new URL(s3FileUrl);
      const path = url.pathname + url.search + url.hash;
      if (proxyBase.startsWith('http')) {
        // Backend proxy: e.g., 'http://localhost:3000/api/proxy-download?url=' + encodeURIComponent(s3FileUrl)
        return `${proxyBase}?url=${encodeURIComponent(s3FileUrl)}`;
      } else {
        // Vite proxy: Replace base with proxy path
        return `${proxyBase}${path}`;
      }
    } catch {
      return s3FileUrl; // Fallback to original
    }
  };

  const proxyUrl = getProxyUrl();
  const downloadFileName = getFileName();

  const handleBinaryDownload = async (url: string) => {
    try {
      setIsDownloading(true);
      setError(null);

      if (!url) {
        throw new Error('File Path does not exist');
      }

      // Fetch the PDF as a Blob via the proxy
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch the PDF file');
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      // Create anchor element for download
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = downloadFileName;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err: any) {
      setError(err?.message || 'Failed to download the file. Try the manual download option.');
      // Fallback: Attempt direct download with <a> tag using original S3 URL
      try {
        const a = document.createElement('a');
        a.href = s3FileUrl;
        a.download = downloadFileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (fallbackErr: any) {
        setError(fallbackErr?.message || 'Fallback download failed. Use "Open in New Tab" to download manually.');
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDirectOpen = () => {
    window.open(s3FileUrl, '_blank');
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex space-x-4">
        <button
          onClick={() => handleBinaryDownload(proxyUrl)}
          disabled={isDownloading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
        >
          {isDownloading ? 'Downloading...' : `Download ${downloadFileName}`}
        </button>
        <button
          onClick={handleDirectOpen}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Open in New Tab (Manual Download)
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-600">
          {error} Try "Open in New Tab" and use Ctrl+S (or right-click → Save As) to download manually.
        </p>
      )}
      <p className="text-sm text-gray-600">
        <strong>Proxy URL:</strong> {proxyUrl}
        <br />
        Note: This fetches the PDF as binary data via a dynamic proxy and triggers an automatic download. If it fails, use "Open in New Tab" and save manually.
      </p>
    </div>
  );
};

export default PDFBinaryDownloader;