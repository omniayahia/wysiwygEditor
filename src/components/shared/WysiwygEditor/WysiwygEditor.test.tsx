import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EditorState } from 'draft-js';
import WysiwygEditor from './WysiwygEditor';

jest.mock('./WysiwygEditor.module.scss', () => ({
  toolbar: 'toolbar',
  activeBtn: 'activeBtn',
  editorContainer: 'editorContainer',
}));

describe('WysiwygEditor Toolbar', () => {
  test('default toolbar buttons', () => {
    render(<WysiwygEditor />);
    expect(screen.getByRole('button', { name: 'B' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '𝑰' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'U̲' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'S̶' })).toBeInTheDocument();
  });

  test('toggle the style on button click', () => {
    render(<WysiwygEditor />);

    const boldBtn = screen.getByRole('button', { name: 'B' });
    expect(boldBtn).not.toHaveClass('activeBtn');

    fireEvent.mouseDown(boldBtn);
    expect(boldBtn).toHaveClass('activeBtn');

    fireEvent.mouseDown(boldBtn);
    expect(boldBtn).not.toHaveClass('activeBtn');
  });

  test('applies active style class to active inline styles', () => {
    render(<WysiwygEditor />);

    const italicBtn = screen.getByRole('button', { name: '𝑰' });
    fireEvent.mouseDown(italicBtn);
    expect(italicBtn).toHaveClass('activeBtn');
  });

  test('supports controlled editorState and onChange', () => {
    const onChangeMock = jest.fn();
    const controlledState = EditorState.createEmpty();

    render(
      <WysiwygEditor
        value={controlledState}
        onChange={onChangeMock}
      />
    );

    const underlineBtn = screen.getByRole('button', { name: 'U̲' });
    fireEvent.mouseDown(underlineBtn);
    expect(onChangeMock).toHaveBeenCalled();
  });

  test('renders custom toolbar when recieve renderToolbar prop', () => {
    const customToolbarText = 'Custom Toolbar';
    const renderToolbar = jest.fn(() => <div>{customToolbarText}</div>);
    render(<WysiwygEditor renderToolbar={renderToolbar} />);
    expect(screen.getByText(customToolbarText)).toBeInTheDocument();
    expect(renderToolbar).toHaveBeenCalled();
  });
});
