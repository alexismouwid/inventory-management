import React, { useState } from 'react';
import axios from 'axios';
import './FormularioProducto.css';

const FormularioProducto = () => {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [talla, setTalla] = useState('');
  const [color, setColor] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [fechaCompra, setFechaCompra] = useState('');
  const [imagen, setImagen] = useState(null);

  const [preview, setPreview] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      const archivo = files[0];
      setImagen(archivo);

      if (archivo) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(archivo);
      } else {
        setPreview('');
      }
    } else {
      switch (name) {
        case 'nombre': setNombre(value); break;
        case 'precio': setPrecio(value); break;
        case 'cantidad': setCantidad(value); break;
        case 'talla': setTalla(value); break;
        case 'color': setColor(value); break;
        case 'precioVenta': setPrecioVenta(value); break;
        case 'fechaCompra': setFechaCompra(value); break;
        default: break;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMensaje('');

    try {
      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('precio', precio);
      formData.append('cantidad', cantidad);
      formData.append('talla', talla);
      formData.append('color', color);
      formData.append('precioVenta', precioVenta);
      formData.append('fechaCompra', fechaCompra);
      formData.append('imagen', imagen);

     await axios.post('https://back-inventory-mmanagement.onrender.com/api/productos/subir', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
 
      setMensaje('✅ Producto agregado correctamente');
      setNombre('');
      setPrecio('');
      setCantidad('');
      setTalla('');
      setColor('');
      setPrecioVenta('');
      setFechaCompra('');
      setImagen(null);
      setPreview('');
    } catch (error) {
      console.error('Error al enviar:', error);
      setMensaje('❌ Error al guardar producto');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="formulario-producto" onSubmit={handleSubmit} encType="multipart/form-data">
      <h2 className="form-titulo">Agregar Producto</h2>
      <div className="form-grid">
        <input type="text" name="nombre" placeholder="Nombre" value={nombre} onChange={handleChange} required className="form-input" />
        <input type="number" name="precio" placeholder="Precio de compra" value={precio} onChange={handleChange} required className="form-input" />
        <input type="number" name="cantidad" placeholder="Cantidad" value={cantidad} onChange={handleChange} required className="form-input" />
        <input type="text" name="talla" placeholder="Talla" value={talla} onChange={handleChange} required className="form-input" />
        <input type="text" name="color" placeholder="Color" value={color} onChange={handleChange} required className="form-input" />
        <input type="number" name="precioVenta" placeholder="Precio de venta" value={precioVenta} onChange={handleChange} required className="form-input" />
        <input type="date" name="fechaCompra" value={fechaCompra} onChange={handleChange} required className="form-input" />
        <input type="file" name="imagen" accept="image/*" onChange={handleChange} required className="form-input" />
      </div>

      {preview && (
        <div className="imagen-preview">
          <p>Vista previa:</p>
          <img src={preview} alt="Vista previa" />
        </div>
      )}

      <button type="submit" disabled={isLoading} className="guardar">
        {isLoading ? 'Enviando...' : 'Guardar producto'}
      </button>

      {mensaje && <p className="form-mensaje">{mensaje}</p>}
    </form>
  );
};

export default FormularioProducto;

