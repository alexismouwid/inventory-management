import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TablaEstilo.css';

const TablaVentas = () => {
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    const obtenerVentas = async () => {
      const res = await axios.get('http://localhost:5000/api/ventas');
      setVentas(res.data);
    };
    obtenerVentas();
  }, []);

  return (
    <div className="tabla-container">
      <h2>Ventas</h2>
      <table className="tabla-excel">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map(venta => (
            <tr key={venta._id}>
              <td>{new Date(venta.createdAt).toLocaleDateString()}</td>
              <td>{venta.nombreProducto}</td>
              <td>{venta.cantidad}</td>
              <td>${venta.precioUnitario.toFixed(2)}</td>
              <td>${(venta.precioUnitario * venta.cantidad).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaVentas;

