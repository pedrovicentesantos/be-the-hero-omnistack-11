import React, { useState } from 'react';
import { FiCheck } from 'react-icons/fi';
import useOnClickOutside from '../../hooks/useOnClickOutside';
import './style.css';

export default function Editable ({ id, data, dataType, inputType, onEditIncident, innerRef }) {
  const [editing, setEditing] = useState(false);
  const [editableData, setEditableData] = useState(data);

  useOnClickOutside(innerRef, () => setEditing(false));
  
  async function handleEdit () {
    try {
      await onEditIncident(id, editableData, dataType);
    } catch (err) {
      alert(err.response.data)
    }
    setEditing(false);
  }

  async function handleKey (e) {
    if (e.key === 'Enter') {
      await handleEdit(e);
    }
  }

  async function handleKeyTextArea (e) {
    if (e.key === 'Enter' && e.ctrlKey) {
      await handleEdit(e);
    }
  }

  if (editing && dataType === 'title') {
    return (
      <div className="editable-input-block">
        <input
          type="text" 
          value={editableData}
          onChange={(e) => {setEditableData(e.target.value)}}
          onKeyUp={handleKey}
        />

        <button onClick={handleEdit}>
          <FiCheck size={20} color="green"/>
        </button>
      </div>
    )
  } else if (editing && dataType === 'value') {
    return (
      <div className="editable-input-block">
        <input
          type="number" 
          value={editableData}
          onChange={(e) => {setEditableData(e.target.value)}}
          onKeyUp={handleKey}
        />

        <button onClick={handleEdit}>
          <FiCheck size={20} color="green"/>
        </button>
      </div>
    )
  } else if (editing && inputType === 'textArea') {
    return (  
      <div className="editable-input-block">
        <textarea
          value={editableData}
          rows="5" 
          cols="33"
          onChange={(e) => {setEditableData(e.target.value)}}
          onKeyUp={handleKeyTextArea}
        />

        <button
          onClick={handleEdit}
        >
          <FiCheck size={20} color="green"/>
        </button>
      </div>
    )
  } else if (dataType === 'value'){
    return (
      <p onClick={() => setEditing(true)}>
        {Intl.NumberFormat(
          'pt-BR', { style: 'currency', currency: 'BRL'})
          .format(data)
        }
      </p>
    )
  } else {
    return (
      <p onClick={() => setEditing(true)}>{data}</p>
    )
  }
}