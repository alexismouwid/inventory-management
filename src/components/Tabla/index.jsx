import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Tabla.css';
import { useDelayedLoading } from '../../utils/useDelayedLoading';

const Tabla = ({ tipo, onVolver }) => {
  const [datos, setDatos] = useState([]);
  const [error, setError] = useState(null);
  const loading = useDelayedLoading(1200);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const token = localStorage.getItem('token');
        const endpoint = tipo === 'productos'
          ? 'https://back-inventory-render.onrender.com/api/productos'
          : 'https://back-inventory-render.onrender.com/api/ventas';

        const response = await axios.get(endpoint, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setDatos(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    obtenerDatos();
  }, [tipo]);

  const encabezados = tipo === 'productos'
    ? ['Fecha de compra', 'Nombre', 'Inversión', 'Precio Unitario', 'Cantidad', 'Precio Venta', 'Utilidad']
    : ['Fecha de venta', 'Nombre', 'Comprador', 'Cantidad Vendida', 'Precio Unitario', 'Total Vendido'];

  if (loading) {
    return <div className="loading-bar">Loading...</div>;
  }

  return (
    <div className="tabla-container">
      <h2 className="titulo-tabla">
        {tipo === 'productos' ? 'Tabla de Productos' : 'Tabla de Ventas'}
      </h2>

      {error ? (
        <p className="error">Error: {error}</p>
      ) : (
        <table className="tabla">
          <thead>
            <tr>
              {encabezados.map((col, index) => (
                <th key={index}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {datos.map((item, index) => (
              <tr key={index}>
                {tipo === 'productos' ? (
                  <>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td>{item.nombre}</td>
                    <td>${item.precio.toFixed(1)}</td>
                    <td>${item.precioUnidad}</td>
                    <td>{item.cantidad}</td>
                    <td>${item.precioVenta.toFixed(1)}</td>
                    <td className={(item.precioVenta ?? 0) >= (item.precioUnidad ?? 0) ? 'positiva' : 'negativa'}>
                      ${((item.precioVenta - item.precioUnidad) * item.cantidad).toFixed(1)}
                    </td>
                  </>
                ) : (
                  <>
                    <td>{new Date(item.fechaVenta).toLocaleDateString()}</td>
                    <td>{item.nombreProducto}</td>
                    <td>{item.nombreCliente}</td>
                    <td>{item.cantidadVendida}</td>
                    <td>${(item.precioVenta).toFixed(1)}</td>
                    <td>${(item.precioVenta * item.cantidadVendida).toFixed(1)}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Tabla;

