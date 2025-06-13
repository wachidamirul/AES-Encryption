import React, { useEffect, useState, useRef } from 'react';

const CBCVisualization: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animationFrame, setAnimationFrame] = useState<number | null>(null);
  
  // Animation parameters
  const blockWidth = 60;
  const blockHeight = 60;
  const blockSpacing = 100;
  const yOffset = 120;
  const arrowLength = 30;
  const animationSpeed = 0.5; // Lower is faster
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = Math.min(800, window.innerWidth - 40);
    canvas.height = 400;
    
    // For high-DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.width * dpr;
    canvas.height = canvas.height * dpr;
    
    canvas.style.width = `${canvas.width / dpr}px`;
    canvas.style.height = `${canvas.height / dpr}px`;
    
    ctx.scale(dpr, dpr);
    
    // Define colors
    const colors = {
      plaintext: '#e0f2fe', // Light blue
      ciphertext: '#dcfce7', // Light green
      iv: '#fef3c7',        // Light yellow
      key: '#fce7f3',       // Light pink
      xor: '#fef2f2',       // Light red
      border: '#64748b',    // Slate
      text: '#1e293b',      // Dark slate
      arrow: '#475569'      // Medium slate
    };
    
    // Animation state
    let progress = 0;
    const maxProgress = 200; // Total animation frames
    
    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate effective progress (0 to 1)
      const effectiveProgress = (progress % maxProgress) / maxProgress;
      
      // Initialize block positions
      const numBlocks = 3;
      const startX = (canvas.width / dpr - (numBlocks * blockWidth + (numBlocks - 1) * blockSpacing)) / 2;
      
      // Draw IV block (special block)
      drawBlock(ctx, startX - blockSpacing, yOffset - blockHeight - 20, blockWidth, blockHeight, 'IV', colors.iv, colors.border, colors.text);
      
      // Draw encryption key
      drawBlock(ctx, canvas.width / dpr / 2 - blockWidth / 2, 50, blockWidth, 40, 'Key', colors.key, colors.border, colors.text);
      
      // Draw the CBC process for each block
      for (let i = 0; i < numBlocks; i++) {
        const blockX = startX + i * (blockWidth + blockSpacing);
        
        // Plaintext block
        drawBlock(ctx, blockX, yOffset - blockHeight - 20, blockWidth, blockHeight, `P${i+1}`, colors.plaintext, colors.border, colors.text);
        
        // XOR block animation
        if (i === 0) {
          // For the first block, XOR with IV
          drawXorOperation(ctx, startX - blockSpacing, blockX, yOffset, effectiveProgress, i, colors);
        } else {
          // For subsequent blocks, XOR with previous ciphertext
          drawXorOperation(ctx, blockX - blockSpacing, blockX, yOffset, effectiveProgress, i, colors);
        }
        
        // Draw AES encryption and key input
        drawEncryption(ctx, canvas.width / dpr, blockX, yOffset + 40, effectiveProgress, i, colors);
        
        // Ciphertext block
        drawBlock(ctx, blockX, yOffset + blockHeight + 60, blockWidth, blockHeight, `C${i+1}`, colors.ciphertext, colors.border, colors.text);
      }
      
      // Advance progress
      progress = (progress + 1) % maxProgress;
      
      // Continue animation
      const frame = requestAnimationFrame(animate);
      setAnimationFrame(frame);
    };
    
    // Start animation
    const frame = requestAnimationFrame(animate);
    setAnimationFrame(frame);
    
    // Cleanup on unmount
    return () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);
  
  // Helper function to draw a block
  const drawBlock = (
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    width: number, 
    height: number, 
    text: string, 
    fillColor: string, 
    borderColor: string, 
    textColor: string
  ) => {
    // Draw block
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fill();
    ctx.stroke();
    
    // Draw text
    ctx.fillStyle = textColor;
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + width / 2, y + height / 2);
  };
  
  // Helper function to draw arrow
  const drawArrow = (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    color: string
  ) => {
    const headLength = 10;
    const angle = Math.atan2(toY - fromY, toX - fromX);
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    
    // Draw line
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
    
    // Draw arrowhead
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - headLength * Math.cos(angle - Math.PI / 6),
      toY - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      toX - headLength * Math.cos(angle + Math.PI / 6),
      toY - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  };
  
  // Draw the XOR operation animation
  const drawXorOperation = (
    ctx: CanvasRenderingContext2D,
    prevBlockX: number,
    blockX: number,
    y: number,
    progress: number,
    blockIndex: number,
    colors: any
  ) => {
    // Calculate animation timing for this block (staggered based on block index)
    const blockDelay = blockIndex * 0.2; // Delay each subsequent block
    let blockProgress = (progress - blockDelay) % 1;
    if (blockProgress < 0) blockProgress = 0;
    
    // Middle XOR position
    const xorX = blockX;
    const xorY = y + 40;
    
    // Draw XOR symbol
    if (blockProgress > 0.3) {
      drawBlock(ctx, xorX, xorY, blockWidth, blockHeight, "⊕", colors.xor, colors.border, colors.text);
    }
    
    // Previous block to XOR arrow animation
    if (blockProgress < 0.3) {
      // Arrow animation from previous block/IV to XOR
      const arrowFromX = prevBlockX + blockWidth / 2;
      const arrowFromY = y - blockHeight/2 - 20;
      
      // Calculate arrow position
      const arrowProgress = blockProgress / 0.3;
      const arrowToX = xorX + blockWidth / 2;
      const arrowToY = xorY + blockHeight / 2;
      
      const currentX = arrowFromX + (arrowToX - arrowFromX) * arrowProgress;
      const currentY = arrowFromY + (arrowToY - arrowFromY) * arrowProgress;
      
      drawArrow(ctx, arrowFromX, arrowFromY, currentX, currentY, colors.arrow);
    } else {
      // Draw completed arrow
      const arrowFromX = prevBlockX + blockWidth / 2;
      const arrowFromY = y - blockHeight/2 - 20;
      const arrowToX = xorX + blockWidth / 2;
      const arrowToY = xorY;
      
      drawArrow(ctx, arrowFromX, arrowFromY, arrowToX, arrowToY, colors.arrow);
    }
    
    // Plaintext to XOR arrow animation
    if (blockProgress > 0.3 && blockProgress < 0.6) {
      // Arrow from plaintext to XOR
      const arrowFromX = blockX + blockWidth / 2;
      const arrowFromY = y - blockHeight/2 - 20;
      
      // Calculate arrow position
      const arrowProgress = (blockProgress - 0.3) / 0.3;
      const arrowToX = xorX + blockWidth / 2;
      const arrowToY = xorY;
      
      const currentX = arrowFromX;
      const currentY = arrowFromY + (arrowToY - arrowFromY) * arrowProgress;
      
      drawArrow(ctx, arrowFromX, arrowFromY, currentX, currentY, colors.arrow);
    } else if (blockProgress >= 0.6) {
      // Draw completed arrow
      const arrowFromX = blockX + blockWidth / 2;
      const arrowFromY = y - blockHeight/2 - 20;
      const arrowToX = xorX + blockWidth / 2;
      const arrowToY = xorY;
      
      drawArrow(ctx, arrowFromX, arrowFromY, arrowToX, arrowToY, colors.arrow);
    }
  };
  
  // Draw the encryption animation
  const drawEncryption = (
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    blockX: number,
    y: number,
    progress: number,
    blockIndex: number,
    colors: any
  ) => {
    // Calculate animation timing for this block
    const blockDelay = blockIndex * 0.2 + 0.6; // Start after XOR animation
    let blockProgress = (progress - blockDelay) % 1;
    if (blockProgress < 0) blockProgress = 0;
    
    // AES encryption box
    const aesX = blockX;
    const aesY = y + blockHeight + 40;
    
    // Draw AES box
    if (blockProgress > 0) {
      ctx.fillStyle = '#f1f5f9'; // Light gray
      ctx.strokeStyle = colors.border;
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      ctx.rect(aesX, aesY, blockWidth, blockHeight);
      ctx.fill();
      ctx.stroke();
      
      // Draw text
      ctx.fillStyle = '#334155'; // Dark gray
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText("AES", aesX + blockWidth / 2, aesY + blockHeight / 2);
    }
    
    // XOR to AES arrow
    if (blockProgress < 0.3) {
      const arrowFromX = blockX + blockWidth / 2;
      const arrowFromY = y + 40 + blockHeight;
      
      // Calculate arrow position
      const arrowProgress = blockProgress / 0.3;
      const arrowToX = aesX + blockWidth / 2;
      const arrowToY = aesY;
      
      const currentX = arrowFromX;
      const currentY = arrowFromY + (arrowToY - arrowFromY) * arrowProgress;
      
      drawArrow(ctx, arrowFromX, arrowFromY, currentX, currentY, colors.arrow);
    } else if (blockProgress >= 0.3) {
      // Draw completed arrow
      const arrowFromX = blockX + blockWidth / 2;
      const arrowFromY = y + 40 + blockHeight;
      const arrowToX = aesX + blockWidth / 2;
      const arrowToY = aesY;
      
      drawArrow(ctx, arrowFromX, arrowFromY, arrowToX, arrowToY, colors.arrow);
    }
    
    // Key to AES arrow
    if (blockProgress > 0.3 && blockProgress < 0.6) {
      const arrowFromX = canvasWidth / 2;
      const arrowFromY = 70;
      
      // Calculate arrow position
      const arrowProgress = (blockProgress - 0.3) / 0.3;
      const arrowToX = aesX + blockWidth / 2;
      const arrowToY = aesY + blockHeight / 2;
      
      const currentX = arrowFromX + (arrowToX - arrowFromX) * arrowProgress;
      const currentY = arrowFromY + (arrowToY - arrowFromY) * arrowProgress;
      
      drawArrow(ctx, arrowFromX, arrowFromY, currentX, currentY, colors.arrow);
    } else if (blockProgress >= 0.6) {
      // Draw completed arrow
      const arrowFromX = canvasWidth / 2;
      const arrowFromY = 70;
      const arrowToX = aesX + blockWidth / 2;
      const arrowToY = aesY + blockHeight / 2;
      
      drawArrow(ctx, arrowFromX, arrowFromY, arrowToX, arrowToY, colors.arrow);
    }
    
    // AES to Ciphertext arrow
    if (blockProgress > 0.6 && blockProgress < 0.9) {
      const arrowFromX = aesX + blockWidth / 2;
      const arrowFromY = aesY + blockHeight;
      
      // Calculate arrow position
      const arrowProgress = (blockProgress - 0.6) / 0.3;
      const arrowToX = blockX + blockWidth / 2;
      const arrowToY = y + blockHeight + 60 + blockHeight / 2;
      
      const currentX = arrowFromX;
      const currentY = arrowFromY + (arrowToY - arrowFromY) * arrowProgress;
      
      drawArrow(ctx, arrowFromX, arrowFromY, currentX, currentY, colors.arrow);
    } else if (blockProgress >= 0.9) {
      // Draw completed arrow
      const arrowFromX = aesX + blockWidth / 2;
      const arrowFromY = aesY + blockHeight;
      const arrowToX = blockX + blockWidth / 2;
      const arrowToY = y + blockHeight + 60 + blockHeight / 2;
      
      drawArrow(ctx, arrowFromX, arrowFromY, arrowToX, arrowToY, colors.arrow);
    }
  };
  
  return (
    <div className="cbc-visualization p-4">
      <h3 className="text-lg font-semibold mb-4">Cipher Block Chaining (CBC) Mode</h3>
      
      <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
        <canvas 
          ref={canvasRef} 
          className="w-full"
          style={{ maxWidth: '800px', height: '400px' }}
        />
      </div>
      
      <div className="mt-4 text-sm text-gray-700">
        <p className="mb-2">
          <strong>CBC Mode Operation:</strong> Each plaintext block is XORed with the previous 
          ciphertext block (or the initialization vector for the first block) before encryption.
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <span className="px-1 bg-blue-100 rounded">P</span> = Plaintext blocks
          </li>
          <li>
            <span className="px-1 bg-green-100 rounded">C</span> = Ciphertext blocks
          </li>
          <li>
            <span className="px-1 bg-yellow-100 rounded">IV</span> = Initialization Vector
          </li>
          <li>
            <span className="px-1 bg-red-100 rounded">⊕</span> = XOR operation
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CBCVisualization;