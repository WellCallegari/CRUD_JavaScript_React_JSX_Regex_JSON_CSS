import React, { useState } from 'react';
import './App.css';
import Modal from './components/Modal';

const generateRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const hexToRgba = (hex, opacity = 0.5) => {
  const [r, g, b] = hex.match(/\w\w/g).map((x) => parseInt(x, 16));
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const App = () => {
  const [people, setPeople] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showList, setShowList] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', birthdate: '', id: null });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [personToDelete, setPersonToDelete] = useState(null);

  const downloadJsonFile = () => {
    const jsonData = JSON.stringify(people, null, 2);

    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dados_pessoas.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    setSuccessMessage('Download realizado com sucesso!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const validateForm = () => {
    let formErrors = {};
    const { name, email, birthdate } = formData;
    const today = new Date();
    const inputDate = new Date(birthdate);

    if (!name) formErrors.name = 'Nome é obrigatório!';
    if (!email || !/\S+@\S+\.\S+/.test(email)) formErrors.email = 'E-mail inválido!';
    if (!birthdate) formErrors.birthdate = 'Data de nascimento é obrigatória!';

    if (!birthdate) {
      formErrors.birthdate = 'Data de nascimento é obrigatória!';
    } else {
      if (inputDate > today) {
        formErrors.birthdate = 'Data de nascimento não pode ser no futuro!';
      } else if (inputDate.getFullYear() < 1900 || inputDate.getFullYear() > today.getFullYear()) {
        formErrors.birthdate = 'Ano inválido! Insira uma data entre 1900 e o ano atual.';
      }
    }

    return formErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      const randomColor = generateRandomColor();
      const colorWithOpacity = hexToRgba(randomColor, 0.70);
      if (formData.id) {
        const updatedPeople = people.map((person) =>
          person.id === formData.id ? { ...formData } : person
        );
        setPeople(updatedPeople);
        setSuccessMessage('Pessoa atualizada com sucesso!');
        setTimeout(() => setSuccessMessage(''), 3000);
        setShowList(true);
        setShowForm(false);
      } else {
        setPeople([...people, { ...formData, id: Date.now(), color: colorWithOpacity }]);
        setSuccessMessage('Pessoa cadastrada com sucesso!');
        setTimeout(() => setSuccessMessage(''), 3000);
        setFormData({ name: '', email: '', birthdate: '', id: null });
      }
      setErrors({});
    } else {
      setErrors(validationErrors);
    }
  };

  const handleCreate = () => {
    setShowForm(true);
    setShowList(false);
    setFormData({ name: '', email: '', birthdate: '', id: null });
    setErrors({});
  };

  const handleList = () => {
    setShowList(true);
    setShowForm(false);
    setErrors({});
  };

  const handleEdit = (id) => {
    const personToEdit = people.find((person) => person.id === id);
    setFormData({ ...personToEdit });
    setShowForm(true);
    setShowList(false);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDelete = (id) => {
    setPersonToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    setPeople(people.filter((person) => person.id !== personToDelete));
    setIsModalOpen(false);
    setPersonToDelete(null);
    setDeleteMessage('Pessoa excluída com sucesso!');
    setTimeout(() => setDeleteMessage(''), 3000);
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setPersonToDelete(null);
  };

  return (
    <div className="App">
      <div className="header-container">
        <h1 className="animated-title"><p>Desafio: Simbiose Ventures</p></h1>
        <p className="animated-subtitle">CRUD Simples: Pessoas</p>
      </div>

      <div className="buttons-container">
        <button onClick={handleCreate} className="create-btn">
          Novo Cadastro
        </button>
        <button onClick={handleList} className="list-btn">
          Ver Cadastros
        </button>
      </div>

      {successMessage && <div className="success-message">{successMessage}</div>}
      {deleteMessage && <div className="delete-message">{deleteMessage}</div>}

      {showForm && (
        <div className="form-container">
          <h1><b>{formData.id ? 'Editar Pessoa' : 'Cadastrar Pessoa'}</b></h1>
          <form onSubmit={handleSubmit} className='center-itens'>
            <div className="input-container">
              <label>Nome:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <div className="error-balloon">{errors.name}</div>}
            </div>
            <div className="input-container">
              <label>E-mail:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <div className="error-balloon">{errors.email}</div>}
            </div>
            <div className="input-container">
              <label>Data de Nascimento:</label>
              <input
                type="date"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
              />
              {errors.birthdate && <div className="error-balloon">{errors.birthdate}</div>}
            </div>
            <div className='card-btn-space'>
              <button type="submit" className="save-btn">
                {formData.id ? 'Atualizar' : 'Cadastrar'}
              </button>
              <button onClick={() => setShowForm(false)} className="cancel-btn">{'Cancelar'}</button>
            </div>
          </form>
        </div>
      )}

      {showList && (
        <div className="list-container">
          <div className=''>
            <button onClick={downloadJsonFile} className='download-button'>Download Json</button>
          <h1>Pessoas Cadastradas</h1>
          
          </div>
          {people.length === 0 ? (
            <p>Não há pessoas cadastradas.</p>
          ) : (
            <div className="cards-wrapper">
              {people.map((person) => (
                <div
                  key={person.id}
                  className="card"
                  style={{ backgroundColor: person.color }}
                >
                  <div className="card-items-conteiner">
                    <div className="card-item">
                      <span className="card-icon">👤</span>
                      <strong>{person.name}</strong>
                    </div>
                    <div className="card-item">
                      <span className="card-icon">📧</span>
                      {person.email}
                    </div>
                    <div className="card-item">
                      <span className="card-icon">🎂</span>
                      {new Date(person.birthdate + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </div>
                  </div>

                  <div className="card-btn-space">
                    <button className="save-btn" onClick={() => handleEdit(person.id)}><span className="card-icon">✏️</span> Editar</button>
                    <button className="cancel-btn" onClick={() => handleDelete(person.id)}><span className="card-icon">🗑️</span> Excluir</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default App;