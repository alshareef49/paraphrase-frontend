import { useState, useRef } from 'react';

interface ParaphraseButtonPosition {
  x: number;
  y: number;
}

export default function TextEditor() {
  const [showButton, setShowButton] = useState(false);
  const [buttonPosition, setButtonPosition] = useState<ParaphraseButtonPosition>({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<Range | null>(null);

  const handleSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (!range.collapsed && editorRef.current?.contains(range.commonAncestorContainer)) {
      const rect = range.getBoundingClientRect();
      const editorRect = editorRef.current.getBoundingClientRect();

      setButtonPosition({
        x: rect.left - editorRect.left + rect.width / 2,
        y: rect.bottom - editorRect.top + 5
      });
      setSelectedText(range.toString());
      setShowButton(true);
      selectionRef.current = range;
    } else {
      setShowButton(false);
    }
  };

  const paraphraseSelectedText = async () => {
  if (!selectedText || !selectionRef.current) return;

  const range = selectionRef.current;

  try {
    const response = await fetch('https://backend-f01z.shuttle.app/paraphrase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: selectedText }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const cleanData = data.paraphrased.replace(/\.$/, '');

    // Restore selection range before modifying DOM
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }

    // Replace selected text with paraphrased version
    if (cleanData) {
      range.deleteContents();
      range.insertNode(document.createTextNode(cleanData));
    }

    setShowButton(false);
  } catch (error) {
    console.error('Paraphrase failed:', error);
    alert('Paraphrase failed. Please try again.');
  }
};


  const handleEditorInput = (event: React.FormEvent<HTMLDivElement>) => {
    setEditorContent(event.currentTarget.textContent || '');
  };

  return (
    <div className="relative max-w-3xl mx-auto my-8">
      <div
        ref={editorRef}
        className="min-h-[300px] p-6 border border-gray-300 rounded-lg font-sans leading-relaxed outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        contentEditable
        onMouseUp={handleSelection}
        onKeyUp={handleSelection}
        onInput={handleEditorInput}
        suppressContentEditableWarning
      >
        {editorContent}
      </div>

      {showButton && (
        <button
          className="absolute px-4 py-2 bg-blue-600 text-white rounded-md shadow-md z-10 transform -translate-x-1/2 hover:bg-blue-700"
          style={{ 
            left: buttonPosition.x,
            top: buttonPosition.y,
          }}
          onClick={paraphraseSelectedText}
        >
          Paraphrase
        </button>
      )}
    </div>
  );
}
