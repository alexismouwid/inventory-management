import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FormularioProducto.css';

const FormularioProducto = () => {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [precioUnidad, setPrecioUnidad] = useState('');
  const [talla, setTalla] = useState('');
  const [color, setColor] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [fechaCompra, setFechaCompra] = useState('');
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [isLoading, setIsLoading] = useState(false);
   const usuario = JSON.parse(localStorage.getItem('usuario'));
 const token = localStorage.getItem('token');
  // Calcular automáticamente el precio por unidad
  useEffect(() => {
    if (precio && cantidad && Number(cantidad) > 0) {
      const calculado = (Number(precio) / Number(cantidad)).toFixed(2);
      setPrecioUnidad(calculado);
    } else {
      setPrecioUnidad('');
    }
  }, [precio, cantidad]);
useEffect(() => {
  if (usuario) {
    setMensaje(`⚠️  Ha iniciado sesión`);
  }
}, []);

  const handleChange = (e) => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const token = localStorage.getItem('token');
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
      formData.append('precioUnidad', precioUnidad);
      formData.append('talla', talla);
      formData.append('color', color);
      formData.append('precioVenta', precioVenta);
      formData.append('fechaCompra', fechaCompra);
      formData.append('imagen', imagen);
      await axios.post(

        'https://back-inventory-render.onrender.com/api/productos/subir',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' ,  
                     'Authorization': `Bearer ${token}`},
         
        }
      );

      setMensaje('✅ Producto agregado correctamente');
      setNombre('');
      setPrecio('');
      setCantidad('');
      setPrecioUnidad('');
      setTalla('');
      setColor('');
      setPrecioVenta('');
      setFechaCompra('');
      setImagen(null);
      setPreview('');
    } catch (error) {
  console.error('Error al enviar:', error);
  if (error.response && error.response.status === 401) {
    setMensaje('❌ No autorizado. Por favor inicia sesión de nuevo.');
  } else {
    setMensaje(`❌ Error al guardar producto: ${error.message}`);
  }
}
 finally {
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

        {/* Input automático para precioUnidad */}
        <input
          type="number"
          name="precioUnidad"
          placeholder="Precio por unidad"
          value={precioUnidad}
          className="form-input"
          readOnly // o disabled si prefieres que no lo pueda editar
        />

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

