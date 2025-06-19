import React, { useEffect } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';

const BrainGradientEditor = () => {
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('brain-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: '', foreground: 'E0E0E0', background: '1e3a8a' }, // base text
          { token: 'comment', foreground: '7F9CF5', fontStyle: 'italic' },
          { token: 'string', foreground: 'F28CB1' },
          { token: 'keyword', foreground: 'C792EA' },
          { token: 'number', foreground: 'F78C6C' },
          { token: 'function', foreground: '82AAFF' },
          { token: 'type', foreground: 'FFCB6B' },
        ],
        colors: {
          'editor.background': '#1e3a8a', // dark blue
          'editor.foreground': '#E0E0E0',
          'editorCursor.foreground': '#F28CB1',
          'editor.lineHighlightBackground': '#70296333',
          'editorLineNumber.foreground': '#94a3b8',
          'editor.selectionBackground': '#70296366',
          'editor.inactiveSelectionBackground': '#70296333',
        },
      });
    }
  }, [monaco]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_30%_30%,_#702963,_#1e3a8a)] p-4">
      <Editor
        height="90vh"
        defaultLanguage="javascript"
        defaultValue="// Start coding your neural ideas..."
        theme="brain-dark"
      />
    </div>
  );
};

export default BrainGradientEditor;
