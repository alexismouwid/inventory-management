// Tabla.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Tabla.css';

const Tabla = ({ tipo, onVolver }) => {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const endpoint = tipo === 'productos'
          ? 'http://localhost:5000/api/productos'
          : 'http://localhost:5000/api/ventas';

        const response = await axios.get(endpoint);
        setDatos(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    obtenerDatos();
  }, [tipo]);

  const encabezados = tipo === 'productos'
    ? ['Fecha de compra', 'Nombre', 'Precio', 'Cantidad', 'Precio Venta', 'Utilidad']
    : ['Nombre','Fecha de venta', 'Comprador', 'Cantidad Vendida', 'Precio Unitario', 'Total Vendido'];

  return (
    <div className="tabla-container">
     
      <h2 className="titulo-tabla">
        {tipo === 'productos' ? 'Tabla de Productos' : 'Tabla de Ventas'}
      </h2>

      {cargando ? (
        <p>Cargando datos...</p>
      ) : error ? (
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
                    <td>{item.cantidad}</td>
                    <td>${item.precioVenta.toFixed(1)}</td>
                    <td>${item.utilidad.toFixed(1)}</td>
                  </>
                ) : (
                  <>
                    <td>{item.nombreProducto}</td>
                    <td>{new Date(item.fechaVenta).toLocaleDateString()}</td>
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

