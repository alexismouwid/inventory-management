import React, { useState } from 'react';
import axios from 'axios';
import './formulario.css';

const Formulario = ({ onVolver }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    cantidad: '',
    talla: '',
    color: '',
    precioVenta: '',
    fechaCompra: '',
    imagen: null
  });
  const [preview, setPreview] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, imagen: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const data = new FormData();
      data.append('nombre', formData.nombre);
      data.append('precio', formData.precio);
      data.append('cantidad', formData.cantidad);
      data.append('talla', formData.talla);
      data.append('color', formData.color);
      data.append('precioVenta', formData.precioVenta);
      data.append('fechaCompra', formData.fechaCompra);
      data.append('imagen', formData.imagen);

      await axios.post('http://localhost:5000/api/subir', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMensaje('✅ Producto agregado correctamente');
      setFormData({
        nombre: '',
        precio: '',
        cantidad: '',
        talla: '',
        color: '',
        precioVenta: '',
        fechaCompra: '',
        imagen: null
      });
      setPreview('');
    } catch (error) {
      setMensaje(error.response?.data?.mensaje || '❌ Error al agregar producto');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="formulario-container">
      <button onClick={onVolver} className="boton-volver">
        <i className="fas fa-arrow-left"></i> Volver al Menú
      </button>

      <h2 className="titulo-formulario">Agregar Nuevo Producto</h2>
      
      <form onSubmit={handleSubmit} className="formulario">
        <div className="form-group">
          <label htmlFor="nombre">Nombre del Producto:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="precio">Precio de Compra:</label>
            <input
              type="number"
              id="precio"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>
            <div className="form-group">
            <label htmlFor="cantidad">Cantidad:</label>
            <input
              type="number"
              id="cantidad"
              name="cantidad"
              value={formData.cantidad}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
        </div>
        <div className="form-row"> 
<div className="form-group">
          <label htmlFor="nombre">Talla:</label>
          <input
            type="text"
            id="talla"
            name="talla"
            value={formData.talla}
            onChange={handleChange}
            required
          />
        </div>
<div className="form-group">
          <label htmlFor="nombre">Color:</label>
          <input
            type="text"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            required
          />
        </div>
        </div>

        <div className="form-row"> 

<div className="form-group">
          <label htmlFor="precioVenta">Precio de Venta:</label>
          <input
            type="number"
            id="precioVenta"
            name="precioVenta"
            value={formData.precioVenta}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="fechaCompra">Fecha de Compra:</label>
          <input
            type="date"
            id="fechaCompra"
            name="fechaCompra"
            value={formData.fechaCompra}
            onChange={handleChange}
            required
          />
        </div>



        </div>
        
        <div className="form-group">
          <label htmlFor="imagen">Imagen del Producto:</label>
          <input
            type="file"
            id="imagen"
            name="imagen"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          {preview && (
            <div className="image-preview">
              <img src={preview} alt="Vista previa" />
            </div>
          )}
        </div>

        <button type="submit" disabled={isLoading} className="boton-enviar">
          {isLoading ? 'Guardando...' : 'Guardar Producto'}
        </button>

        {mensaje && (
          <div className={`mensaje ${mensaje.includes('✅') ? 'exito' : 'error'}`}>
            {mensaje}
          </div>
        )}
      </form>
    </div>
  );
};

export default Formulario;
