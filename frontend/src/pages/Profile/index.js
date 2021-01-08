import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiPower,FiTrash2, FiEdit } from 'react-icons/fi';

import api from '../../services/api';

import logoImg from '../../assets/logo.svg';

import Editable from '../../components/Editable';

import './style.css';

export default function Profile() {
  const [incidents, setIncidents] = useState([]);

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

  async function handleEditIncident (id, data, dataType) {
    try {
      await api.patch(`incidents/${id}`, { [dataType]: data }, {
        headers : {
          Authorization: ongId
        }
      });

      setIncidents(incidents.map(incident => {
        if (incident.id === id) {
          incident[dataType] = data;
        }
        return incident
      }));

    } catch (err) {
      alert(err.response.data.error);
    }
    
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
        <Link className="edit-button" to="profile/edit">
          <FiEdit size={25} color="#bc9604" />
        </Link>

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
              <Editable 
                onEditIncident={handleEditIncident} 
                id={incident.id} 
                data={incident.title} 
                dataType="title" 
                inputType="input"
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
        ))}
      </ul>
    </div>
  );
}