'use client';

import { useTheme } from './ThemeProvider';

export default function ThemePreview() {
  const { theme } = useTheme();
  
  const colorSamples = [
    { name: 'Primary', variants: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] },
    { name: 'Gray', variants: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] },
  ];

  return (
    <div className="fixed top-4 left-4 p-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-50 max-w-md max-h-[90vh] overflow-auto">
      <h2 className="text-lg font-bold mb-3 text-gray-800 dark:text-white">Theme Preview</h2>
      <p className="text-sm mb-4 text-gray-600 dark:text-gray-300">Current theme: {theme}</p>
      
      <div className="space-y-6">
        {colorSamples.map((colorType) => (
          <div key={colorType.name}>
            <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">{colorType.name}</h3>
            <div className="grid grid-cols-11 gap-1">
              {colorType.variants.map((variant) => (
                <div key={variant} className="flex flex-col items-center">
                  <div 
                    className={`w-8 h-8 rounded-md mb-1 bg-${colorType.name.toLowerCase()}-${variant}`}
                    style={{ 
                      backgroundColor: `rgb(var(--color-${colorType.name.toLowerCase()}-${variant}))` 
                    }}
                  ></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{variant}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">UI Examples</h3>
        <div className="space-y-2">
          <button className="w-full py-2 px-4 bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 text-white rounded-lg">
            Primary Button
          </button>
          <button className="w-full py-2 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg">
            Secondary Button
          </button>
          <input 
            type="text" 
            placeholder="Input example"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>
    </div>
  );
}
