import { useState, useEffect } from 'react';
import MenuPrincipal from './components/MenuPrincipal';
import FormularioLogin from './components/FormularioLogin';
import FormularioRegistro from './components/FormularioRegistro';
import './App.css';

function App() {
  const [usuario, setUsuario] = useState(JSON.parse(localStorage.getItem("usuario")) || null);
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(!!localStorage.getItem("token"));
  const [actualizarLista, setActualizarLista] = useState(false);
  const [mostrarLogin, setMostrarLogin] = useState(true);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
    setUsuarioAutenticado(false);
  };

  const toggleRegistro = () => {
   setMostrarRegistro(true);
  setMostrarLogin(false);
  }

  const toggleLogin = () => {
 setMostrarLogin(true);
  setMostrarRegistro(false);
  }

  const verificarSesion = () => {
    const token = localStorage.getItem("token");
    console.log("Token en localStorage:", token);
    setUsuarioAutenticado(!!token);
  };

  useEffect(() => {
    verificarSesion();
  }, []);

  return (
  <div>
      {!usuarioAutenticado && mostrarLogin && (
        <FormularioLogin
          verificarSesion={verificarSesion}
          toggleRegistro={toggleRegistro}
          setLogin={setMostrarLogin}
          setRegistro={setMostrarRegistro}
        />
      )}

      {!usuarioAutenticado && mostrarRegistro && (
        <FormularioRegistro
          toggleLogin={toggleLogin}
          setLogin={setMostrarLogin}
          setRegistro={setMostrarRegistro}
        />
      )}

      {usuarioAutenticado && (
        <>
          <MenuPrincipal
            onActualizar={setActualizarLista}
            cerrarSesion={cerrarSesion}
            setUsuario={setUsuario}
            setUsuarioAutenticado={setUsuarioAutenticado}
          />
          
        </>
      )}
    </div>  );
}

export default App;

