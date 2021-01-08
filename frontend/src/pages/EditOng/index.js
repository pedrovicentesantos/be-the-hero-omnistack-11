import React from 'react';

import logoImg from '../../assets/logo.svg';

export default function EditOng () {

  const ongId = localStorage.getItem('ongId');
  const ongName = localStorage.getItem('ongName');

  return (
    <header>
      <img src={logoImg} alt="Be the Hero"/>
      <span>Bem vinda, {ongName}</span>
    
    </header>
  )
}