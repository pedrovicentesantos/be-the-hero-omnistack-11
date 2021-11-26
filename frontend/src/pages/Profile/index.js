import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiPower, FiEdit } from 'react-icons/fi';
import Incident from '../../components/Incident'
import api from '../../services/api';
import logoImg from '../../assets/logo.svg';
import './style.css';

export default function Profile() {
  const [incidents, setIncidents] = useState([]);
  const [filter, setFilter] = useState('mais-antigos');

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
      filterIncidents[filter]();

    } catch (err) {
      alert(err.response.data.error);
    }
  }

  const filterIncidents = {
    'mais-recentes': () => {
      setIncidents(incidents.sort((a, b) => b.id - a.id))
    },
    'mais-antigos': () => {
      setIncidents(incidents.sort((a, b) => a.id - b.id))
    },
    'alfabetica': () => {
      setIncidents(incidents.sort((a, b) => a.title.localeCompare(b.title)))
    },
    'maiores-valores': () => {
      setIncidents(incidents.sort((a, b) => b.value - a.value))
    },
    'menores-valores': () => {
      setIncidents(incidents.sort((a, b) => a.value - b.value))
    }
  }

  function handleFilter(e) {
    setFilter(e.target.value);
    filterIncidents[e.target.value]();
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

      <section className="incidents-header">
        <h1>Casos Cadastrados</h1>
        <select value={filter} onChange={handleFilter}>
          <option value="mais-antigos">Mais Antigos</option>
          <option value="mais-recentes">Mais Recentes</option>
          <option value="alfabetica">Ordem Alfabética</option>
          <option value="maiores-valores">Maiores Valores</option>
          <option value="menores-valores">Menores Valores</option>
        </select>
      </section>

      <ul className="incidents-container">
        {incidents.map(incident => (
          <Incident
            key={incident.id}
            incident={incident}
            handleDeleteIncident={handleDeleteIncident}
            handleEditIncident={handleEditIncident}
          />
        ))}
      </ul>
    </div>
  );
}