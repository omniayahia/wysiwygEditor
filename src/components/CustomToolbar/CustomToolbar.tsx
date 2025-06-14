import React, { useMemo } from 'react';
import { EditorState } from 'draft-js';
import styles from '../shared/WysiwygEditor/WysiwygEditor.module.scss';

interface ToolbarProps {
  editorState: EditorState;
  onToggle?: (style: string) => void;
  onBlockToggle?: (blockType: string) => void;
}

const blockTypes = [
  { type: 'header-one', label: 'H1' },
  { type: 'header-two', label: 'H2' },
  { type: 'header-three', label: 'H3' },
  { type: 'unordered-list-item', label: '•' },
  { type: 'ordered-list-item', label: '1.' },
  { type: 'blockquote', label: '❝' },
];

const CustomToolbar: React.FC<ToolbarProps> = React.memo(({ editorState, onBlockToggle }) => {
  const currentBlockType = useMemo(() => {
    const selection = editorState.getSelection();
    return editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType();
  }, [editorState]);

  return (
    <div className={styles.toolbar}>
      {blockTypes.map((item) => {
        const isActive = currentBlockType === item.type;
        return (
          <button
            key={item.type}
            onMouseDown={(e) => {
              e.preventDefault();
              onBlockToggle?.(item.type);
            }}
            className={isActive ? styles.activeBtn : ''}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
});

export default CustomToolbar;
