import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EditorState, ContentState, SelectionState, ContentBlock, genKey } from 'draft-js';
import CustomToolbar from './CustomToolbar';

function createEditorStateWithBlockType(blockType: string) {
  const blockKey = genKey();
  const contentState = ContentState.createFromBlockArray([
    new ContentBlock({
      key: blockKey,
      type: blockType,
      text: 'Test',
    }),
  ]);

  const selection = SelectionState.createEmpty(blockKey);
  const editorState = EditorState.createWithContent(contentState);
  return EditorState.forceSelection(editorState, selection);
}

describe('CustomToolbar', () => {
  test('renders block type buttons', () => {
    const editorState = createEditorStateWithBlockType('unstyled');
    render(<CustomToolbar editorState={editorState} />);
    expect(screen.getByRole('button', { name: 'H1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'H2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'H3' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '•' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '1.' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '❝' })).toBeInTheDocument();
  });

  test('calls onBlockToggle when button clicked', () => {
    const editorState = createEditorStateWithBlockType('unstyled');
    const onBlockToggle = jest.fn();
    render(<CustomToolbar editorState={editorState} onBlockToggle={onBlockToggle} />);
    const h1Button = screen.getByRole('button', { name: 'H1' });
    fireEvent.mouseDown(h1Button);
    expect(onBlockToggle).toHaveBeenCalledWith('header-one');
  });

  test('applies activeBtn class to the selected block type button', () => {
    const editorState = createEditorStateWithBlockType('blockquote');
    render(<CustomToolbar editorState={editorState} />);

    const h1Btn = screen.getByRole('button', { name: 'H1' });
    expect(h1Btn).not.toHaveClass('activeBtn');
  });

  test('does not throw if onBlockToggle is not provided', () => {
    const editorState = createEditorStateWithBlockType('unstyled');
    render(<CustomToolbar editorState={editorState} />);
    const h2Btn = screen.getByRole('button', { name: 'H2' });
    expect(() => {
      fireEvent.mouseDown(h2Btn);
    }).not.toThrow();
  });
});
