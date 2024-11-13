import React from 'react';
import './Modal.css';

function Modal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h3>Tem certeza que deseja excluir esta pessoa?</h3>
        <div className="modal-actions">
          <button onClick={onClose} className="modal-cancel-btn">Cancelar</button>
          <button onClick={onConfirm} className="modal-confirm-btn">Confirmar</button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
