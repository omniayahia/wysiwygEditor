import { useState } from 'react';
import { EditorState } from 'draft-js';
import './assets/styles/main.scss';
import WysiwygEditor from './components/shared/WysiwygEditor/WysiwygEditor';
import CustomToolbar from './components/CustomToolbar/CustomToolbar';

function App() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [customToolbarEditorState, setCustomToolbarEditorState] = useState(EditorState.createEmpty());

  return (
    <div className="container">
      <h2>Controlled Editor</h2>
      <p>Controlled editor with style props</p>
      <WysiwygEditor
        value={editorState}
        onChange={setEditorState}
        style={{
          marginBottom: '50px',
          minHeight: '300px'
        }}
      />
      <h2>Uncontrolled Editor</h2>
      <p>Uncontrolled editor with style and className props to change the editor theme</p>
      <WysiwygEditor
        className='darkEditor'
        style={{
          marginBottom: '50px',
          minHeight: '300px'
        }}
      />
      <h2>Custom Toolbar</h2>
      <p>Controlled editor with custom toolbar</p>
      <WysiwygEditor
        value={customToolbarEditorState}
        onChange={setCustomToolbarEditorState}
        renderToolbar={({ editorState, onBlockToggle }) => (
          <CustomToolbar
            editorState={editorState!}
            onBlockToggle={onBlockToggle}
          />
        )}
        style={{
          marginBottom: '50px',
        }}
      />
    </div>
  );
}

export default App;
