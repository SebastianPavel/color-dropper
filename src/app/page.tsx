'use client'
import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
 import IconColorPicker from '../public/IconColorPicker.svg';
import SelectedColor from '../public/SelectedColor.svg';
import ImageUploader from './components/ImageUploader';
import ColorDropper from './components/ColorDropper';

const Home: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isColorPickerActive, setIsColorPickerActive] = useState(false);
  const [copyMessage, setCopyMessage] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleColorPick = (color: string) => {
    setSelectedColor(color);
    copyToClipboard(color);
  };

  const handleImageUpload = (imageDataUrl: string) => {
    setUploadedImage(imageDataUrl);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyMessage('Color copied to clipboard!');
      setTimeout(() => setCopyMessage(''), 3000); // Clear message after 3 seconds
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  };

  useEffect(() => {
    if (uploadedImage && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const img = document.createElement('img');
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
        };
        img.src = uploadedImage;
      }
    }
  }, [uploadedImage]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Color Dropper App</title>
        <meta name="description" content="Professional color dropper application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="text-3xl font-bold mb-8">Color Dropper App</h1>
        <div className="mb-4">
          <ImageUploader onImageUpload={handleImageUpload} />
        </div>
        {uploadedImage && (
          <>
          <div className='flex'>

            <div className="flex items-center mb-4">
              <button
                onClick={() => setIsColorPickerActive(!isColorPickerActive)}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                <IconColorPicker width={24} height={24} className="mr-2" />
                <span>{isColorPickerActive ? 'Deactivate' : 'Activate'} Color Picker</span>
              </button>
            </div>
            {selectedColor && (
              <div className="flex items-center">
            <SelectedColor width={24} height={24} />
            <div
              className="w-8 h-8 rounded-full border-2 border-gray-300 ml-2"
              style={{ backgroundColor: selectedColor }}
              ></div>
            <p className="ml-2">{selectedColor}</p>
          </div>
        )}
        </div>
        
            <div className="relative">
              <canvas ref={canvasRef} className="border border-gray-300" />
              {isColorPickerActive && (
                <ColorDropper canvasRef={canvasRef} onColorPick={handleColorPick} />
              )}
            </div>
          </>
        )}
        
      </main>
    </div>
  );
};

 
export default Home;