import React, { useState } from 'react';
import Formulario from '../Formulario';
import ListaProductos from '../ListaProductos';
import ListaVentas from '../ListaVentas';
import Tabla from '../Tabla';
import './MenuPrincipal.css';

const MenuPrincipal = () => {
  const [vistaActual, setVistaActual] = useState(''); // Empieza sin vista
  const [tipoTabla, setTipoTabla] = useState(null);

  const renderVista = () => {
    switch (vistaActual) {
      case 'formulario':
        return <Formulario />;
      case 'productos':
        return <ListaProductos />;
      case 'ventas':
        return <ListaVentas />;
      case 'tabla':
        return <Tabla tipo={tipoTabla} />;
      default:
        return <div>Selecciona una opción del menú</div>;
    }
  };

  return (
    <div className="app-container">
      <div className="menu-lateral">
        <button onClick={() => setVistaActual('formulario')} className="menu-boton">Agregar Nuevo Producto</button>
        <button onClick={() => setVistaActual('productos')} className="menu-boton">Ver Inventario</button>
        <button onClick={() => setVistaActual('ventas')} className="menu-boton">Mis ventas</button>
        <button onClick={() => { setTipoTabla('productos'); setVistaActual('tabla'); }} className="menu-boton">Tabla de Productos</button>
        <button onClick={() => { setTipoTabla('ventas'); setVistaActual('tabla'); }} className="menu-boton">Tabla de Ventas</button>
      </div>
      <div className="contenido-principal">
        {renderVista()}
      </div>
    </div>
  );
};

export default MenuPrincipal;

