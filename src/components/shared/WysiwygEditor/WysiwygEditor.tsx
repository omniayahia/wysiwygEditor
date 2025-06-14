import React, { useState, useCallback } from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
} from 'draft-js';
import { OrderedSet } from 'immutable';
import 'draft-js/dist/Draft.css';
import styles from './WysiwygEditor.module.scss';

interface ToolbarProps {
  currentInlineStyle: OrderedSet<string>;
  onToggle: (textStyle: string) => void;
  onBlockToggle?: (blockType: string) => void;
  editorState?: EditorState;
}

interface WysiwygEditorProps {
  value?: EditorState;
  onChange?: (state: EditorState) => void;
  className?: string;
  style?: React.CSSProperties;
  renderToolbar?: (props: ToolbarProps) => React.ReactNode;
}

const customStyleMap = {
  STRIKETHROUGH: {
    fontWeight: 'bold',
    backgroundColor: '#f4f4f4',
    padding: '10px',
    textDecoration: 'line-through',
    color: '#000'
  },
};

const DefaultToolbar: React.FC<ToolbarProps> = React.memo(({ currentInlineStyle, onToggle }) => {
  const toolbarItems: { style: string; label: string }[] = [
    { style: 'BOLD', label: 'B' },
    { style: 'ITALIC', label: '𝑰' },
    { style: 'UNDERLINE', label: 'U̲' },
    { style: 'STRIKETHROUGH', label: 'S̶' },
  ];

  return (
    <div className={styles.toolbar}>
      {toolbarItems.map((toolbarItem) => {
        const isActive = currentInlineStyle.has(toolbarItem.style);
        return (
          <button
            key={toolbarItem.style}
            onMouseDown={(e) => {
              e.preventDefault();
              onToggle(toolbarItem.style);
            }}
            className={isActive ? styles.activeBtn : ''}
            title={toolbarItem.style}
          >
            {toolbarItem.label}
          </button>
        );
      })}
    </div>
  );
});

const WysiwygEditor: React.FC<WysiwygEditorProps> = ({
  value,
  onChange,
  className = '',
  style = {},
  renderToolbar,
}) => {
  const isControlled = value !== undefined && onChange !== undefined;
  const [internalEditorState, setInternalEditorState] = useState<EditorState>(
    () => EditorState.createEmpty()
  );

  const editorState = isControlled ? value! : internalEditorState;
  const setEditorState = useCallback(
    (newState: EditorState) => {
      if (isControlled) {
        onChange(newState);
      } else {
        setInternalEditorState(newState);
      }
    },
    [isControlled, onChange]
  );

  const handleToggleTextStyle = (textStyle: string) => {
    const newState = RichUtils.toggleInlineStyle(editorState, textStyle);
    setEditorState(newState);
  };

  const handleToggleBlockType = (blockType: string) => {
    const newState = RichUtils.toggleBlockType(editorState, blockType);
    setEditorState(newState);
  };

  const handleChange = (newState: EditorState) => {
    setEditorState(newState);
  };

  const currentInlineStyle = editorState.getCurrentInlineStyle();

  const toolbar = renderToolbar ? (
    renderToolbar({
      currentInlineStyle,
      onToggle: handleToggleTextStyle,
      onBlockToggle: handleToggleBlockType,
      editorState,
    })
  ) : (
    <DefaultToolbar
      currentInlineStyle={currentInlineStyle}
      onToggle={handleToggleTextStyle}
    />
  );

  return (
    <div
      className={`${styles.editorContainer} ${className}`}
      style={{ ...style }}
    >
      {toolbar}
      <Editor
        editorState={editorState}
        onChange={handleChange}
        customStyleMap={customStyleMap}
      />
    </div>
  );
};

export default WysiwygEditor;
