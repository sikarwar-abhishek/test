/**
 * Parse chess puzzle instructions with special formatting
 * Handles \\n line breaks, **bold** text, and bullet points
 */
export function parseChessInstructions(instructionText) {
  if (!instructionText) return instructionText;

  // Convert \\n to actual line breaks
  let parsed = instructionText.replace(/\\n/g, '\n');
  
  return parsed;
}

/**
 * Convert formatted instruction text to React components
 */
export function renderFormattedInstructions(instructionText) {
  if (!instructionText) return null;

  // Parse the text
  const parsed = parseChessInstructions(instructionText);
  
  // Split by double line breaks to get sections
  const sections = parsed.split('\n\n');
  
  return sections.map((section, sectionIndex) => {
    if (!section.trim()) return null;
    
    // Check if section starts with **bold** text (likely a header)
    const lines = section.split('\n');
    const elements = [];
    
    lines.forEach((line, lineIndex) => {
      if (!line.trim()) return;
      
      // Handle bold headers like **Chess puzzle Instructions:**
      if (line.includes('**')) {
        const boldRegex = /\*\*(.*?)\*\*/g;
        const parts = line.split(boldRegex);
        
        elements.push(
          <div key={`${sectionIndex}-${lineIndex}`} className="font-semibold text-black mb-2">
            {parts.map((part, partIndex) => {
              // Odd indices are the bold parts
              if (partIndex % 2 === 1) {
                return <strong key={partIndex}>{part}</strong>;
              }
              return part;
            })}
          </div>
        );
      }
      // Handle bullet points
      else if (line.trim().startsWith('- ')) {
        const bulletText = line.trim().substring(2);
        elements.push(
          <div key={`${sectionIndex}-${lineIndex}`} className="ml-4 mb-1 flex">
            <span className="mr-2">•</span>
            <span>{bulletText}</span>
          </div>
        );
      }
      // Handle arrows and special formatting
      else if (line.includes('→')) {
        elements.push(
          <div key={`${sectionIndex}-${lineIndex}`} className="ml-4 mb-1 font-mono text-sm">
            {line.trim()}
          </div>
        );
      }
      // Handle numbered examples
      else if (/^\d+\./.test(line.trim())) {
        elements.push(
          <div key={`${sectionIndex}-${lineIndex}`} className="ml-4 mb-1 font-mono text-sm">
            {line.trim()}
          </div>
        );
      }
      // Regular text
      else {
        elements.push(
          <div key={`${sectionIndex}-${lineIndex}`} className="mb-1">
            {line.trim()}
          </div>
        );
      }
    });
    
    return (
      <div key={sectionIndex} className="mb-4">
        {elements}
      </div>
    );
  });
}
