// filepath: /Users/gr/Projects/combifi-web/src/components/ui/OTPInput.tsx
'use client';

import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  className?: string;
}

export function OTPInput({
  value,
  onChange,
  length = 4,
  className = '',
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(value.split('').slice(0, length).concat(Array(length - value.length).fill('')));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  // Update OTP state when external value changes
  useEffect(() => {
    if (value) {
      setOtp(value.split('').slice(0, length).concat(Array(length - value.length).fill('')));
    } else {
      setOtp(Array(length).fill(''));
    }
  }, [value, length]);

  // Focus the next input after typing
  const focusNextInput = (index: number) => {
    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Focus the previous input when deleting
  const focusPrevInput = (index: number) => {
    if (index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    
    // Allow both upper and lowercase letters and numbers, then convert to uppercase
    const sanitizedValue = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    
    if (sanitizedValue) {
      // Only take the last character if multiple were pasted
      const lastChar = sanitizedValue.slice(-1);
      
      const newOtp = [...otp];
      newOtp[index] = lastChar;
      setOtp(newOtp);
      
      // Combine OTP values and call onChange
      const otpValue = newOtp.join('');
      onChange(otpValue);
      
      focusNextInput(index);
    }
  };

  // Handle backspace and left/right arrow keys
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (otp[index]) {
        // If current input has a value, clear it
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
        
        // Combine OTP values and call onChange
        onChange(newOtp.join(''));
      } else if (index > 0) {
        // If current input is empty, focus previous input and clear its value
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        
        // Combine OTP values and call onChange
        onChange(newOtp.join(''));
        
        // Focus the previous input
        focusPrevInput(index);
      }
    } else if (e.key === 'ArrowLeft') {
      focusPrevInput(index);
    } else if (e.key === 'ArrowRight') {
      focusNextInput(index);
    }
  };

  // Handle paste event for the entire OTP
  const handlePaste = (e: React.ClipboardEvent, index: number) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    
    // Filter out non-alphanumeric characters and convert to uppercase
    const sanitizedData = pastedData.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    
    if (sanitizedData) {
      // Fill OTP inputs from paste position
      const newOtp = [...otp];
      
      for (let i = 0; i < length - index && i < sanitizedData.length; i++) {
        newOtp[index + i] = sanitizedData[i];
      }
      
      setOtp(newOtp);
      onChange(newOtp.join(''));
      
      // Focus the next empty input or the last input
      const nextEmptyIndex = newOtp.findIndex((value) => !value);
      if (nextEmptyIndex !== -1 && nextEmptyIndex < length) {
        inputRefs.current[nextEmptyIndex]?.focus();
      } else {
        inputRefs.current[length - 1]?.focus();
      }
    }
  };

  return (
    <div className={`flex justify-center gap-2 ${className}`}>
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          type="text"
          ref={(ref) => {
            inputRefs.current[index] = ref;
          }}
          value={otp[index] || ''}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={(e) => handlePaste(e, index)}
          className="w-14 h-14 text-center text-xl font-bold border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all duration-200"
          maxLength={1}
          autoComplete="off"
          inputMode="text"
          style={{ textTransform: 'uppercase' }}
        />
      ))}
    </div>
  );
}
