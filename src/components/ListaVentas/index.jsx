import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ListaVentas.css';
import { useDelayedLoading } from '../../utils/useDelayedLoading';

const ListaVentas = ({ onVolver }) => {
  const [ventas, setVentas] = useState([]);
  const [error, setError] = useState(null);
  const [actualizar, setActualizar] = useState(false);
  const [imagenes, setImagenes] = useState({});
  const [imagenesCargadas, setImagenesCargadas] = useState(false);
  const token = localStorage.getItem('token');
  const loading = useDelayedLoading(1200);

  useEffect(() => {
    const obtenerVentas = async () => {
      try {
        if (!token) throw new Error('No hay token disponible');
        
        const response = await axios.get('https://back-inventory-render.onrender.com/api/ventas', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        setVentas(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        console.error('Error al obtener ventas:', err);
      }
    };

    obtenerVentas();
  }, [actualizar]);

  const obtenerImagenVenta = async (id) => {
    const response = await axios.get(
      `https://back-inventory-render.onrender.com/api/ventas/${id}/imagen`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      }
    );

    return URL.createObjectURL(response.data);
  };

  useEffect(() => {
    const cargarImagenes = async () => {
      const nuevasImagenes = {};

      for (const venta of ventas) {
        try {
          const url = await obtenerImagenVenta(venta._id);
          nuevasImagenes[venta._id] = url;
        } catch (error) {
          console.error('❌ Error al cargar imagen de', venta.nombreProducto || venta._id, error.message);
        }
      }

      setImagenes(nuevasImagenes);
      setImagenesCargadas(true);
    };

    if (ventas.length > 0) {
      cargarImagenes();
    } else {
      setImagenesCargadas(true);
    }
  }, [ventas, token]);

  useEffect(() => {
    return () => {
      Object.values(imagenes).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagenes]);

  const eliminarVenta = async (id) => {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar esta venta?');
    if (!confirmacion) return;

    try {
      await axios.delete(`https://back-inventory-render.onrender.com/api/ventas/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setActualizar(!actualizar);
    } catch (err) {
      alert('Error al eliminar el registro de venta: ' + err.message);
    }
  };

  if (loading || !imagenesCargadas) {
    return <div className="loading-bar">Loading...</div>;
  }

  if (error) {
    return (
      <div className="lista-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="lista-container">
      <h2 className="titulo-listaVentas">Historial de Ventas</h2>
      
      <div className="grid-tarjetasVentas">
        {ventas.map((venta) => (
          <div key={venta._id} className="tarjeta-venta">
            {imagenes[venta._id] ? (
              <img
                src={imagenes[venta._id]}
                alt={venta.nombreProducto}
                className="imagen-venta"
              />
            ) : (
              <div className="placeholder-imagen">Sin imagen</div>
            )}

            <div className="cuerpo-tarjeta">
              <h3>{venta.nombreProducto}</h3>
              <div className="detalles-venta">
                <p><strong>Cliente:</strong> {venta.nombreCliente || 'No especificado'}</p>
                <p><strong>Cantidad Vendida:</strong> {venta.cantidadVendida}</p>
                <p><strong>Precio:</strong> ${venta.precioVenta.toFixed(2)}</p>
                <p><strong>Total:</strong> ${(venta.precioVenta * venta.cantidadVendida).toFixed(2)}</p>
                <p className={`estado-pago ${venta.pagado ? 'pagado' : 'pendiente'}`}>
                  {venta.pagado ? 'Pagado' : 'Pendiente de pago'}
                </p>
                <p><small>Fecha: {new Date(venta.fechaVenta).toLocaleDateString()}</small></p>
                <button 
                  onClick={() => eliminarVenta(venta._id)}
                  className="boton-eliminar"
                >
                  <i className="fas fa-trash"></i> Eliminar venta
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListaVentas;

