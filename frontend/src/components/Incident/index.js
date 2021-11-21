import React, { useRef, useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import Editable from '../../components/Editable';
import Modal from '../../components/Modal';
import './style.css';

const Incident = ({ incident, handleEditIncident,  handleDeleteIncident }) => {
  const titleRef = useRef();
  const descriptionRef = useRef();
  const valueRef = useRef();

  const [showModal, setShowModal] = useState(false);

  function hideModal() {
    setShowModal(false);
  }

  return (
    <li>
      <Modal
        showModal={showModal}
        hideModal={hideModal}
        incident={incident}
        handleDelete={handleDeleteIncident}
      />
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
      <div ref={descriptionRef} className="editable-container">
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
      <div ref={valueRef} className="editable-container">
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
        onClick={() => setShowModal(true)} 
        type="button"
      >
        <FiTrash2 size={20} color="A8A8B3" />
      </button>
    </li>
  )
}

export default Incident;
