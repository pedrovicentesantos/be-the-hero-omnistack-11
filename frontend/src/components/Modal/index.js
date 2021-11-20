import React, { useRef } from 'react';
import { FiXCircle } from 'react-icons/fi';
import useOnClickOutside from '../../hooks/useOnClickOutside';
import './style.css';

function Modal({ incident, showModal, hideModal, handleDelete }) {
  const ref = useRef();
  useOnClickOutside(ref, hideModal);

  return (
    <>
      {showModal && 
        <div className="modal-container">
          <section ref={ref} className="modal">
            <div className="modal-content">
              <FiXCircle onClick={hideModal} size={25} />
              <p>Tem certeza que quer deletar o caso <b>{incident.title}</b>?</p>
              <div className="modal-footer">
                <button onClick={() => handleDelete(incident.id)} className="danger" type="button">Deletar</button>
                <button onClick={hideModal} className="success" type="button">Cancelar</button>
              </div>
            </div>
          </section>
        </div>
      }
    </>
  )
}

export default Modal;
