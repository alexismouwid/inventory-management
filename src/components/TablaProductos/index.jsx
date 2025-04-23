import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TablaEstilo.css';

const TablaProductos = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const obtenerProductos = async () => {
      const res = await axios.get('http://localhost:5000/api/productos');
      setProductos(res.data);
    };
    obtenerProductos();
  }, []);

  return (
    <div className="tabla-container">
      <h2>Productos</h2>
      <table className="tabla-excel">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Precio Venta</th>
            <th>Utilidad Total</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(producto => (
            <tr key={producto._id}>
              <td>{new Date(producto.createdAt).toLocaleDateString()}</td>
              <td>{producto.nombre}</td>
              <td>${producto.precio.toFixed(2)}</td>
              <td>{producto.cantidad}</td>
              <td>${producto.precioVenta.toFixed(2)}</td>
              <td>${((producto.precioVenta - producto.precio) * producto.cantidad).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaProductos;

