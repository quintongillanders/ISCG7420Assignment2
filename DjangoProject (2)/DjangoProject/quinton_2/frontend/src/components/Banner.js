import React, { useEffect } from 'react';

export default function Banner({ type = 'info', message = '', autoHideMs = 3000, onClose }) {
  useEffect(() => {
    if (!message || !autoHideMs) return;
    const id = setTimeout(() => onClose && onClose(), autoHideMs);
    return () => clearTimeout(id);
  }, [message, autoHideMs, onClose]);

  if (!message) return null;

  const styles = {
    base: {
      margin: '12px 0',
      padding: '10px 12px',
      borderRadius: '6px',
      border: '1px solid',
    },
    success: {
      background: '#e6ffed',
      color: '#046c4e',
      borderColor: '#b7f5c8',
    },
    error: {
      background: '#ffebeb',
      color: '#8a1111',
      borderColor: '#f7b3b3',
    },
    info: {
      background: '#eaf4ff',
      color: '#0b4b8c',
      borderColor: '#c7e1ff',
    },
  };

  const style = { ...styles.base, ...(styles[type] || styles.info) };

  return (
    <div role="status" style={style}>
      {message}
    </div>
  );
}
