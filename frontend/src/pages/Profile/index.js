import React, { useEffect, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiCheck, FiPower,FiTrash2 } from 'react-icons/fi';

import api from '../../services/api';

import logoImg from '../../assets/logo.svg';

import './style.css';

export default function Profile() {
  const [incidents, setIncidents] = useState([]);

  const [editingTitle, setEditingTitle] = useState(false);
  const [editingValue, setEditingValue] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);

  const titleRef = useRef();
  const valueRef = useRef();
  const descriptionRef = useRef();

  const history = useHistory();

  const ongId = localStorage.getItem('ongId');
  const ongName = localStorage.getItem('ongName');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get('profile', {
          headers: {
            Authorization: ongId,
          }
        });

        if (response.status === 200) {
          setIncidents(response.data);
        }
        
      } catch (err) {
        if (err.response.data.status !== 204) {
          alert(err.response.data.error);
        }
      }
    }
    fetchData();
  }, [ongId]);

  async function handleDeleteIncident(id) {
    try {
      await api.delete(`incidents/${id}`, {
        headers: {
          Authorization: ongId,
        }
      });

      setIncidents(incidents.filter(incident => incident.id !== id));
    } catch(err) {
      alert(err.response.data);
    }
  }

  async function handleEditIncidentTitle (id) {
    try {
      const title = titleRef.current.value;
      await api.patch(`incidents/${id}`, {title}, {
        headers : {
          Authorization: ongId
        }
      });
      setIncidents(incidents.map(incident => {
        if (incident.id === id) {
          incident.title = title;  
        }
        return incident
      }))
    } catch (err) {
      alert(err.response.data.error);
    }
    setEditingTitle(false);
  }

  async function handleEditIncidentDescription (id) {
    try {
      const description = descriptionRef.current.value;
      await api.patch(`incidents/${id}`, {description}, {
        headers : {
          Authorization: ongId
        }
      });
      setIncidents(incidents.map(incident => {
        if (incident.id === id) {
          incident.description = description;  
        }
        return incident
      }))
    } catch (err) {
      alert(err.response.data.error);
    }
    setEditingDescription(false);
  }

  async function handleEditIncidentValue (id) {
    try {
      const value = valueRef.current.value;
      await api.patch(`incidents/${id}`, {value}, {
        headers : {
          Authorization: ongId
        }
      });
      setIncidents(incidents.map(incident => {
        if (incident.id === id) {
          incident.value = value;  
        }
        return incident
      }))
    } catch (err) {
      alert(err.response.data.error);
    }
    setEditingValue(false);
  }

  function handleLogout() {
    localStorage.clear();

    history.push('/');
  }

  return (
    <div className="profile-container">
      <header>
        <img src={logoImg} alt="Be the Hero"/>
        <span>Bem vinda, {ongName}</span>

        <Link className="button" to="/incidents/new">Cadastrar novo caso</Link>
        <button onClick={handleLogout} type="button">
          <FiPower size={18} color="#E02041" />
        </button>
      </header>

      <h1>Casos Cadastrados</h1>

      <ul>
        {incidents.map(incident => (
          <li key={incident.id}>
            <strong>CASO:</strong>
            <div className="editable-container">
              {editingTitle ?  (
                <div className="editable-input-block">
                  <input
                    type="text" 
                    ref={titleRef}
                    defaultValue={incident.title}
                  />
                  <button
                    onClick={ () => handleEditIncidentTitle(incident.id) }
                  >
                    <FiCheck size={20} color="green"/>
                  </button>
                </div>
              ) : (
                <p onClick={() => setEditingTitle(true)}>{incident.title}</p>
              )
              }
            </div>

            <strong>DESCRIÇÃO:</strong>
            <div className="editable-container">
              {editingDescription ?  (
                <div className="editable-input-block">
                  <textarea
                    ref={descriptionRef}
                    defaultValue={incident.description}
                    rows="5" 
                    cols="33"
                  />
                  <button
                    onClick={ () => handleEditIncidentDescription(incident.id) }
                  >
                    <FiCheck size={20} color="green"/>
                  </button>
                </div>
              ) : (
                <p onClick={() => setEditingDescription(true)}>{incident.description}</p>
              )
              }
            </div>

            <strong>VALOR:</strong>
            <div className="editable-container">
              {editingValue ?  (
                <div className="editable-input-block">
                  <input
                    type="text"
                    ref={valueRef}
                    defaultValue={incident.value}
                  />
                  <button
                    onClick={ () => handleEditIncidentValue(incident.id) }
                  >
                    <FiCheck size={20} color="green"/>
                  </button>
                </div>
              ) : (
                <p onClick={() => setEditingValue(true)}>
                  {Intl.NumberFormat(
                    'pt-BR', 
                    { style: 'currency', currency: 'BRL'})
                    .format(incident.value)}
                </p>
              )
              }
            </div>

            <button 
              className="delete-button" 
              onClick={() => handleDeleteIncident(incident.id)} 
              type="button"
            >
              <FiTrash2 size={20} color="A8A8B3" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}