'use client';
import React, { useEffect, useRef } from 'react';

const Modal = ({ isOpen, onClose, content }) => {
  const modalRef = useRef();

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.showModal();
    } else {
      modalRef.current?.close();
    }
  }, [isOpen]);

  return (
    <dialog ref={modalRef} className="modal" id="testimonial_modal">
      <div className="modal-box">
        <form method="dialog">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={onClose}
          >
            ✕
          </button>
        </form>
        {content && (
          <>
            <h3 className="font-bold text-lg">{content.title}</h3>
            <p className="py-4">"{content.quote}"</p>
            <p className="text-sm text-gray-500 mt-2">
              – {content.name}, {content.role}
            </p>
          </>
        )}
      </div>
    </dialog>
  );
};

export default Modal;
