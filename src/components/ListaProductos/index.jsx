import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalVenta from '../ModalVenta';
import './ListaProductos.css';

const ListaProductos = ({ onVolver }) => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [actualizar, setActualizar] = useState(false);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const response = await axios.get('https://back-inventory-mmanagement.onrender.com/api/productos');
        setProductos(response.data);
      } catch (err) {
        setError(err.message || 'Error al cargar productos');
      } finally {
        setCargando(false);
      }
    };

    obtenerProductos();
  }, [actualizar]);

  const abrirModalVenta = (producto) => {
    setProductoSeleccionado(producto);
    setMostrarModal(true);
  };

  const eliminarProducto = async (id) => {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este producto?');
    if (!confirmacion) return;

    try {
      await axios.delete(`https://back-inventory-mmanagement.onrender.com/api/productos/${id}`);
      setActualizar(prev => !prev); // Vuelve a cargar los productos
    } catch (err) {
      alert('Error al eliminar el producto: ' + err.message);
    }
  };

  if (cargando) return (
    <div className="lista-container">
     
      <div className="cargando">Cargando productos...</div>
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
    

      <h2 className="titulo-lista">Inventario de Productos</h2>
      
      <div className="grid-tarjetas">
        {productos.map((producto) => (
          <div key={producto._id} className="tarjeta-producto">
          
           <img 
  src={`https://back-inventory-mmanagement.onrender.com/api/productos/${producto._id}/imagen`} 
  alt={producto.nombre} 
  className="imagen-producto"
             onError={(e) => {
               e.target.style.display = 'none';
             }}
/>
           
            <div className="cuerpo-tarjeta">
              <h3>{producto.nombre}</h3>
              <div className="detalles-producto">
                <p><span>Precio total:</span> ${producto.precio?.toFixed(2) ?? '0.00'}</p>
                 <p><span>Precio por unidad:</span> {producto.precioUnidad}</p>
                <p><span>Cantidad:</span> {producto.cantidad}</p>
                <p><span>Inversion:</span> ${producto.precio?.toFixed(1) * producto.cantidad ?? '0.00'}</p>
                <p className="utilidad">
                  <span>Utilidad:</span> 
                  <span 
                    className={(producto.precioVenta ?? 0) >= (producto.precio ?? 0) ? 'positiva' : 'negativa'}>
                    ${((producto.precioVenta - producto.precio) * producto.cantidad).toFixed(1)}
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

