import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { TextField, Button, Typography, Box, Paper } from '@mui/material';

export default function AnimatedAvatar({
  eyeColor = '#000',
  skinColor = '#fdd',
  strokeColor = '#222',
  backgroundColor = 'white',
  messageText = 'Page not found',
  buttonText = 'Go back',
  inputPlaceholder = 'Type something...',
  onButtonClick = () => console.log('Button clicked'),
  inputPosition = 'bottom' // 'top' or 'bottom'
}) {
  const [eyeY, setEyeY] = useState(0);
  const [eyeX, setEyeX] = useState(0);
  const [error, setError] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [mouthCurve, setMouthCurve] = useState(-1); // -1 for sad, 0 for neutral, 1 for happy
  const inputRef = useRef(null);
  const svgRef = useRef(null);

  // Update animation based on input value length
  useEffect(() => {
    // Set eye X position based on input length (longer text = eyes look more to the right)
    const inputLength = inputValue.length;
    const maxInputLength = 20;
    
    // Map input length to eye movement range (-3 to 3)
    const maxEyeShift = 3;
    
    // Calculate normalized position from -1 to 1 based on input length
    const normalizedLength = Math.min(inputLength / maxInputLength, 1);
    
    // Move eyes horizontally based on text length
    // As text gets longer, eyes move from left to right
    const eyeXPosition = (normalizedLength * 2 - 1) * maxEyeShift;
    
    // Set eye positions
    setEyeX(eyeXPosition);
    
    // Eyes look down more as text gets longer
    const eyeYPosition = normalizedLength * 2;
    setEyeY(eyeYPosition);
    
    // Determine target mouth curve based on password length
    let targetCurve;
    if (inputValue.length === 0) {
      targetCurve = -1; // Sad for empty password
    } else if (inputValue.length < 15) {
      targetCurve = 0;  // Neutral for short password
    } else {
      // Increasingly happy for longer passwords (15+ chars)
      targetCurve = Math.min(1, (inputValue.length - 15) / 15);
    }
    
    // Smoothly animate mouth towards target value
    setMouthCurve(prev => {
      const step = 0.08;
      if (Math.abs(prev - targetCurve) < step) {
        return targetCurve; // We're close enough to target
      }
      return prev < targetCurve ? prev + step : prev - step;
    });
    
  }, [inputValue]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleButtonClick = () => {
    // Toggle the error state to trigger animation
    setError(false);
    
    // Reset after animation
    setTimeout(() => {
      onButtonClick();
      setError(true);
    }, 500);
  };

  // Calculate mouth path based on curve value
  const getMouthPath = () => {
    const startX = 65;
    const endX = 135;
    const baseY = 125;
    const midX = 100;
    
    // Calculate how much the middle point should curve
    // POSITIVE value moves mouth DOWN (sad)
    // NEGATIVE value moves mouth UP (happy)
    const curveMagnitude = 20; // Maximum curve amount
    
    // For happy face (positive mouthCurve), move mouth UP (negative Y direction)
    // For sad face (negative mouthCurve), move mouth DOWN (positive Y direction)
    const curveOffset = mouthCurve * curveMagnitude;
    
    const midY = baseY + curveOffset;

    return `M ${startX} ${baseY} Q ${midX} ${midY} ${endX} ${baseY}`;
  };

  const inputElement = (
    <TextField
      inputRef={inputRef}
      type="password"
      value={inputValue}
      onChange={handleInputChange}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      placeholder={inputPlaceholder}
      variant="outlined"
      fullWidth
      size="medium"
      sx={{
        maxWidth: '400px',
        '& .MuiOutlinedInput-root': {
          '&.Mui-focused fieldset': {
            borderColor: '#3f51b5',
          },
        },
      }}
    />
  );

  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      {inputPosition === 'top' && (
        <Box sx={{ mb: 4, width: '100%', maxWidth: '400px', display: 'flex', justifyContent: 'center' }}>
          {inputElement}
        </Box>
      )}
      
      <Paper 
        elevation={3}
        sx={{
          position: 'relative',
          width: '256px',
          height: '256px',
          borderRadius: '50%',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box sx={{ 
          width: '100%', 
          height: '100%',
          transform: error ? 'scale(1)' : 'scale(0)',
          transition: 'transform 0.5s'
        }}>
          <svg 
            ref={svgRef}
            viewBox="0 0 200 200" 
            style={{ width: '100%', height: '100%' }}
          >
            <circle 
              cx="100" 
              cy="100" 
              r="90" 
              fill={backgroundColor} 
              stroke={strokeColor} 
              strokeWidth="4"
            />
            <g transform="translate(0,8)">
              {/* Left Eye */}
              <circle 
                cx="70" 
                cy="80" 
                r="20" 
                fill="white" 
                stroke={strokeColor} 
                strokeWidth="2.5"
              />
              <circle 
                cx={70 + eyeX} 
                cy={80 + eyeY} 
                r="10" 
                fill={eyeColor}
              />
              
              {/* Right Eye */}
              <circle
                cx="130" 
                cy="80" 
                r="20" 
                fill="white" 
                stroke={strokeColor} 
                strokeWidth="2.5"
              />
              <circle
                cx={130 + eyeX} 
                cy={80 + eyeY} 
                r="10" 
                fill={eyeColor}
              />
              
              {/* Smooth animated mouth */}
              <path 
                d={getMouthPath()}
                fill="none" 
                stroke={strokeColor} 
                strokeWidth="3" 
                strokeLinecap="round"
              />
            </g>
          </svg>
        </Box>
      </Paper>
      
      <Typography variant="h5" component="h2" sx={{ mt: 3, fontWeight: 'bold' }}>
        {messageText}
      </Typography>
      
      {inputPosition === 'bottom' && (
        <Box sx={{ mt: 3, width: '100%', maxWidth: '400px', px: 2 }}>
          {inputElement}
        </Box>
      )}

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleButtonClick}
          sx={{ 
            px: 3, 
            py: 1, 
            borderRadius: '24px',
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: '#303f9f',
            }
          }}
        >
          {buttonText}
        </Button>
      </Box>
    </Box>
  );
}