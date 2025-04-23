import React, { useState } from 'react';
import Formulario from '../Formulario';
import ListaProductos from '../ListaProductos';
import ListaVentas from '../ListaVentas';
import Tabla from '../Tabla';
import './MenuPrincipal.css';

const MenuPrincipal = () => {
  const [vistaActual, setVistaActual] = useState('menu');
  const [tipoTabla, setTipoTabla] = useState(null); // 'productos' o 'ventas'

  const renderVista = () => {
    switch (vistaActual) {
      case 'formulario':
        return <Formulario onVolver={() => setVistaActual('menu')} />;
      case 'productos':
        return <ListaProductos onVolver={() => setVistaActual('menu')} />;
      case 'ventas':
        return <ListaVentas onVolver={() => setVistaActual('menu')} />;
      case 'tabla':
        return <Tabla tipo={tipoTabla} onVolver={() => setVistaActual('menu')} />;
      default:
        return (
          <div className="menu-container">
            <h1 className="titulo-menu">Sistema de Gestión de Productos</h1>
            <div className="menu-opciones">
              <button onClick={() => setVistaActual('formulario')} className="menu-boton">
                Agregar Nuevo Producto
              </button>
              <button onClick={() => setVistaActual('productos')} className="menu-boton">
                Ver Inventario
              </button>
              <button onClick={() => setVistaActual('ventas')} className="menu-boton">
                Mis ventas
              </button>
              <button 
                onClick={() => {
                  setTipoTabla('productos');
                  setVistaActual('tabla');
                }} 
                className="menu-boton"
              >
                Tabla de Productos
              </button>
              <button 
                onClick={() => {
                  setTipoTabla('ventas');
                  setVistaActual('tabla');
                }} 
                className="menu-boton"
              >
                Tabla de Ventas
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      {renderVista()}
    </div>
  );
};

export default MenuPrincipal;

