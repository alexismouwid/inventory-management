import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ListaVentas.css';

const ListaVentas = ({ onVolver }) => {
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [actualizar, setActualizar] = useState(false);

  useEffect(() => {
    const obtenerVentas = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/ventas');
        setVentas(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    obtenerVentas();
  }, [actualizar]);

const eliminarVenta = async (id) => {
  const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este producto?');
  if (!confirmacion) return;

  try {
    await axios.delete(`http://localhost:5000/api/ventas/${id}`);
    setActualizar(!actualizar); // Vuelve a cargar los productos
  } catch (err) {
    alert('Error al eliminar el registro de venta: ' + err.message);
  }
};


  if (cargando) return (
    <div className="lista-container">
      <button onClick={onVolver} className="boton-volver">
        <i className="fas fa-arrow-left"></i> Volver al Menú
      </button>
      <div className="cargando">Cargando ventas...</div>
    </div>
  );

  if (error) return (
    <div className="lista-container">
      <button onClick={onVolver} className="boton-volver">
        <i className="fas fa-arrow-left"></i> Volver al Menú
      </button>
      <div className="error">Error: {error}</div>
    </div>
  );

  return (
    <div className="lista-container">
      <button onClick={onVolver} className="boton-volver">
        <i className="fas fa-arrow-left"></i> Volver al Menú
      </button>

      <h2 className="titulo-listaVentas">Historial de Ventas</h2>
      
      <div className="grid-tarjetasVentas">
        {ventas.map((venta) => (
          <div key={venta._id} className="tarjeta-producto">
            {venta.imagenUrl && (
              <img 
                src={`http://localhost:5000${venta.imagenUrl}`} 
                alt={venta.nombreProducto} 
                className="imagen-productoVenta"
              />
            )}
            <div className="cuerpo-tarjeta">
              <h3>{venta.nombreProducto}</h3>
              <div className="detalles-producto">
                <p> {venta.nombreCliente || 'No especificado'}</p>
                <p>{venta.cantidadVendida}</p>
                <p>${venta.precioVenta.toFixed(2)}</p>
                <p> ${(venta.precioVenta * venta.cantidadVendida).toFixed(2)}</p>
                <p className={`estado-pago ${venta.pagado ? 'pagado' : 'pendiente'}`}>
                  {venta.pagado ? 'Pagado' : 'Pendiente de pago'}
                </p>
                <p><small>Fecha: {new Date(venta.createdAt).toLocaleString()}</small></p>
                <button 
  onClick={() => eliminarVenta(venta._id)}
  className="boton-eliminar"
>
  <i className="fas fa-trash"></i> Eliminar producto
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
