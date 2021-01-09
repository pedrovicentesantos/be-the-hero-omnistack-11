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
  }, []);

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

        <form >
          <input 
            type="text" 
            placeholder="Nome da ONG"
            value={ong.name}
            required
          />
          <input 
            type="email" 
            placeholder="Email"
            value={ong.email}
            required
          />
          <input 
            type="text" 
            placeholder="Whatsapp"
            value={ong.whatsapp}
            required
          />

          <div className="input-group">
            <input 
              type="text" 
              placeholder="Cidade"
              value={ong.city}
              required
            />
            <input 
              type="text" 
              placeholder="UF" 
              minLength={2}
              maxLength={2}
              style={{ width:80 }}
              value={ong.uf}
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