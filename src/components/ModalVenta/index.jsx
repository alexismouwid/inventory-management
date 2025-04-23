import React, { useState } from 'react';
import axios from 'axios';
import './ModalVenta.css';

const ModalVenta = ({ producto, onClose, onVentaExitosa }) => {
  const [formData, setFormData] = useState({
    cantidad: 1,
    nombreCliente: '',
    pagado: true
  });
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje('');

    try {
      const cantidad = parseInt(formData.cantidad);
      if (cantidad <= 0 || cantidad > producto.cantidad) {
        throw new Error('Cantidad no válida');
      }

      const response = await axios.post('http://localhost:5000/api/ventas', {
        productoId: producto._id,
        cantidadVendida: cantidad,
        nombreCliente: formData.nombreCliente.trim(),
        pagado: formData.pagado
      });

      setMensaje('✅ Venta registrada correctamente');
      setTimeout(() => {
        onVentaExitosa();
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error:', error);
      setMensaje(error.response?.data?.mensaje || error.message || '❌ Error al registrar venta');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-contenido">
        <button className="cerrar-modal" onClick={onClose}>Cerrar
          <i className="fas fa-times"></i>
        </button>
        
        <div className="modal-header">
          <h3>Registrar Venta</h3>
          <p className="producto-nombre">{producto.nombre}</p>
        </div>

        <div className="modal-info">
          <div className="info-item">
            <span>Precio unitario:</span>
            <span>${producto.precioVenta.toFixed(2)}</span>
          </div>
          <div className="info-item">
            <span>Stock disponible:</span>
            <span>{producto.cantidad} unidades</span>
          </div>
          <div className="info-item">
            <span>Total potencial:</span>
            <span>${(producto.precioVenta * formData.cantidad).toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="formulario-venta">
          <div className="form-group">
            <label htmlFor="cantidad">Cantidad a vender</label>
            <input
              type="number"
              id="cantidad"
              name="cantidad"
              min="1"
              max={producto.cantidad}
              value={formData.cantidad}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="nombreCliente">Nombre del cliente</label>
            <input
              type="text"
              id="nombreCliente"
              name="nombreCliente"
              value={formData.nombreCliente}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group-check">
            <label>
              <input
                type="checkbox"
                name="pagado"
                checked={formData.pagado}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              Pago realizado
            </label>
          </div>

          <button type="submit" disabled={cargando} className="boton-confirmar">
            {cargando ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Procesando...
              </>
            ) : (
              <>
                <i className="fas fa-check-circle"></i> Confirmar Venta
              </>
            )}
          </button>
        </form>

        {mensaje && (
          <div className={`mensaje ${mensaje.includes('✅') ? 'exito' : 'error'}`}>
            {mensaje}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalVenta;
