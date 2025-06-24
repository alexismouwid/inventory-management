import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalVenta from '../ModalVenta';
import './ListaProductos.css';
import { useDelayedLoading } from '../../utils/useDelayedLoading';

const ListaProductos = ({ onVolver }) => {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [actualizar, setActualizar] = useState(false);
  const [imagenes, setImagenes] = useState({});
  const [imagenesCargadas, setImagenesCargadas] = useState(false);

  const token = localStorage.getItem('token');
  const loading = useDelayedLoading(1200);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const response = await axios.get('https://back-inventory-render.onrender.com/api/productos', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProductos(response.data);
      } catch (err) {
        setError(err.message || 'Error al cargar productos');
      }
    };

    obtenerProductos();
  }, [actualizar]);

  const obtenerImagenProducto = async (id) => {
    const response = await axios.get(
      `https://back-inventory-render.onrender.com/api/productos/${id}/imagen`,
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
      for (const producto of productos) {
        try {
          const url = await obtenerImagenProducto(producto._id);
          nuevasImagenes[producto._id] = url;
        } catch (error) {
          console.error('Error al cargar imagen de', producto.nombre);
        }
      }
      setImagenes(nuevasImagenes);
      setImagenesCargadas(true);
    };

    if (productos.length > 0) {
      cargarImagenes();
    } else {
      setImagenesCargadas(true);
    }
  }, [productos, token]);

  const abrirModalVenta = (producto) => {
    setProductoSeleccionado(producto);
    setMostrarModal(true);
  };

  const eliminarProducto = async (id) => {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este producto?');
    if (!confirmacion) return;

    try {
      await axios.delete(`https://back-inventory-render.onrender.com/api/productos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActualizar(prev => !prev);
    } catch (err) {
      alert('Error al eliminar el producto: ' + err.message);
    }
  };

  // Mostrar loader si no ha pasado el tiempo de espera o aún no se han cargado las imágenes
  if (loading || !imagenesCargadas) {
    return (
      <div className="loading-bar">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="lista-container">
        <button onClick={onVolver} className="boton-volver">
          <i className="fas fa-arrow-left"></i> Volver al Menú
        </button>
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="lista-container">
      <h2 className="titulo-lista">Inventario de Productos</h2>

      <div className="grid-productos">
        {productos.map((producto) => (
          <div key={producto._id} className="tarjeta-producto">
            {imagenes[producto._id] ? (
              <img
                src={imagenes[producto._id]}
                alt={producto.nombre}
                className="imagen-producto"
              />
            ) : (
              <p>Cargando imagen...</p>
            )}

            <div className="cuerpo-tarjeta-p">
              <h3>{producto.nombre}</h3>
              <div className="detalles-producto">
                <p><span>Precio total:</span> ${producto.precio?.toFixed(2) ?? '0.00'}</p>
                <p><span>Precio por unidad:</span> {producto.precioUnidad}</p>
                <p><span>Precio de venta:</span> ${producto.precioVenta?.toFixed(1) ?? '0.00'}</p>
                <p><span>Cantidad:</span> {producto.cantidad}</p>
                <p><span>Inversión:</span> ${producto.precioUnidad?.toFixed(1) * producto.cantidad ?? '0.00'}</p>
                <p className="utilidad">
                  <span>Utilidad:</span>
                  <span className={(producto.precioVenta ?? 0) >= (producto.precioUnidad ?? 0) ? 'positiva' : 'negativa'}>
                    ${((producto.precioVenta - producto.precioUnidad) * producto.cantidad).toFixed(1)}
                  </span>
                </p>
              </div>

              <button
                onClick={() => abrirModalVenta(producto)}
                className="boton-vender"
                disabled={producto.cantidad <= 0}
              >
                <i className="fas fa-cash-register"></i> {producto.cantidad <= 0 ? 'Sin Stock' : 'Vender'}
              </button>

              <button
                onClick={() => eliminarProducto(producto._id)}
                className="boton-eliminar"
              >
                <i className="fas fa-trash"></i> Eliminar producto
              </button>
            </div>
          </div>
        ))}
      </div>

      {mostrarModal && (
        <ModalVenta
          producto={productoSeleccionado}
          onClose={() => setMostrarModal(false)}
          onVentaExitosa={() => setActualizar(prev => !prev)}
        />
      )}
    </div>
  );
};

export default ListaProductos;

