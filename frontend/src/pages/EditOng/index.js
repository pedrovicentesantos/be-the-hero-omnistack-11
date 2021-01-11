import React, { useEffect, useState } from 'react';

import { Link, useHistory } from 'react-router-dom';

import { FiArrowLeft } from 'react-icons/fi';

import api from '../../services/api';

import logoImg from '../../assets/logo.svg';

import './style.css';

export default function EditOng () {
  const ongId = localStorage.getItem('ongId');

  const history = useHistory();

  const [ong, setOng] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get('self', {
          headers: {
            Authorization: ongId,
          }
        });

        if (response.status === 200) {
          setOng(response.data);
        }
        
      } catch (err) {
        alert(err.response.data.error);
      }
    }

    fetchData();
  }, [ongId]);

  async function handleEditOng(e) {
    e.preventDefault();

    const data = {
      name: ong.name,
      email: ong.email,
      whatsapp: ong.whatsapp,
      city: ong.city,
      uf: ong.uf
    }

    try {

      const response = await api.patch('ongs', data, {
        headers: {
          Authorization: ongId
        }
      });

      if (response.status === 200) {
        history.push('/profile');
        localStorage.clear();
        localStorage.setItem('ongId', response.data.id);
        localStorage.setItem('ongName', response.data.name);
        setOng(response.data);
      }

    } catch (err) {
      alert('Erro no cadastro, tente novamente.');
    }
  }

  async function handleDeleteOng () {
    try {
      const response = await api.delete('ongs', {
        headers: {
          Authorization: ongId,
        }
      });

      if (response.status === 204) {
        localStorage.clear();

        history.push('/');
      }
    } catch (err) {
      alert(err.response.data.error);
    }
  }

  return (
    <div className="edit-ong-container">
      <div className="content">
        <section>
          <img src={logoImg} alt="Be the Hero"/>

          <h1>Editar dados da ONG</h1>
          <p>Edite seus dados ou delete sua conta aqui.</p>

          <Link className="back-link" to="/profile">
            <FiArrowLeft size={16} color="#E02041"/>
            Voltar para home
          </Link>
        </section>

        <form onSubmit={handleEditOng}>
          <input 
            type="text" 
            value={ong.name || ''}
            onChange={(e) => {setOng({...ong, name: e.target.value})}}
            required
          />
          <input 
            type="email" 
            value={ong.email || ''}
            onChange={(e) => {setOng({...ong, email: e.target.value})}}
            required
          />
          <input 
            type="text" 
            value={ong.whatsapp || ''}
            onChange={(e) => {setOng({...ong, whatsapp: e.target.value})}}
            required
          />

          <div className="input-group">
            <input 
              type="text" 
              value={ong.city || ''}
              onChange={(e) => {setOng({...ong, city: e.target.value})}}
              required
            />
            <input 
              type="text" 
              minLength={2}
              maxLength={2}
              style={{ width:80 }}
              value={ong.uf || ''}
              onChange={(e) => {setOng({...ong, uf: e.target.value})}}
              required
            />
          </div>
          <div className="buttons">
            <button id="save-button" type="submit">
              Salvar
            </button>
            <button onClick={handleDeleteOng} id="delete-button" type="button">
              Deletar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}