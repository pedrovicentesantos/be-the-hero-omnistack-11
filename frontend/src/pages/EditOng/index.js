import React, { useEffect } from 'react';

import { Link, useHistory } from 'react-router-dom';

import { FiArrowLeft } from 'react-icons/fi';

import logoImg from '../../assets/logo.svg';

import './style.css';

export default function EditOng () {

  const ongId = localStorage.getItem('ongId');
  const ongName = localStorage.getItem('ongName');

  useEffect(() => {

  }, []);

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

        {/* <form onSubmit={handleNewIncident}>
          <input 
            type="text" 
            placeholder="Título do caso" 
            value={title}
            onChange={e => setTitle(e.target.value)}      
            required     
          />
          <textarea 
            placeholder="Descrição"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          >
          </textarea>
          <input 
            type="text" 
            placeholder="Valor em reais"
            value={value}
            onChange={e => setValue(e.target.value)}
            required
          />

          <button className="button" type="submit">
            Cadastrar
          </button>
        </form> */}
      </div>
    </div>
  )
}