import React, { useRef } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import Editable from '../../components/Editable';
import './style.css';

const Incident = ({ incident, handleEditIncident,  handleDeleteIncident }) => {
  const titleRef = useRef();
  const descriptionRef = useRef();
  const valueRef = useRef();

  return (
    <li>
      <strong>CASO:</strong>
      <div ref={titleRef} className="editable-container">
        <Editable 
          onEditIncident={handleEditIncident} 
          id={incident.id} 
          data={incident.title} 
          dataType="title" 
          inputType="input"
          innerRef={titleRef}
        />
      </div>
      
      <strong>DESCRIÇÃO:</strong>
      <div className="editable-container">
        <Editable 
          onEditIncident={handleEditIncident} 
          id={incident.id} 
          data={incident.description} 
          dataType="description" 
          inputType="textArea"
          innerRef={descriptionRef}
        />
      </div>
      
      <strong>VALOR:</strong>
      <div className="editable-container">
        <Editable 
          onEditIncident={handleEditIncident} 
          id={incident.id} 
          data={incident.value} 
          dataType="value" 
          inputType="input"
          innerRef={valueRef}
        />
      </div>
      
      <button 
        className="delete-button" 
        onClick={() => handleDeleteIncident(incident.id)} 
        type="button"
      >
        <FiTrash2 size={20} color="A8A8B3" />
      </button>
    </li>
  )
}

export default Incident;
