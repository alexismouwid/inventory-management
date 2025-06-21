import React, { Component } from "react";
import axios from "axios";
import "./FormularioRegistro.css";

class FormularioRegistro extends Component {
  state = {
    nombre: "",
    email: "",
    password: "",
    error: "",
    loading: false,
    success: ""
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

 handleSubmit = async (e) => {
  e.preventDefault();
  this.setState({ loading: true, error: "", success: "" }); // Resetear mensajes y activar loading
  
  const { nombre, email, password } = this.state;
 const { toggleLogin  } = this.props;

  try {
    const response = await axios.post("https://back-inventory-render.onrender.com/api/auth/register", {
      nombre,
      email,
      password,
    });

    // Guardar token en localStorage (asumiendo que el backend devuelve el token directamente)
    localStorage.setItem("token", response.data.token);
    
    // Mostrar mensaje de éxito
    this.setState({ 
      success: `Registro exitoso. Bienvenido, ${nombre}!`,
      loading: false
    });
    
    // Opcional: Limpiar formulario después de 3 segundos
    setTimeout(() => {
      this.setState({ 
        nombre: "",
        email: "",
        password: "",
        success: ""
      });
      toggleLogin();
    }, 2000);

  } catch (error) {
    this.setState({ 
      error: error.response?.data?.message || "Error en el registro. Intenta de nuevo.",
      loading: false
    });
  }
};
  render() {
    const { email, password, error, loading, success } = this.state;
    const { toggleLogin, setRegistro, setLogin } = this.props;
    return (
      <div className="formulario-container">

          <form className="formulario-register" onSubmit={this.handleSubmit}>
            <h1 className="register-title">Registrarse</h1>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              className="input-personalizado"
              value={this.state.nombre}
              onChange={this.handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Correo Electrónico"
              className="input-personalizado"
              value={email}
              onChange={this.handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              className="input-personalizado"
              value={password}
              onChange={this.handleChange}
              required
            />
        <div className="botones-container">
          <button 
            type="submit" 
            className="registrar"
            disabled={loading} // Deshabilitar botón durante carga
          >
            {loading ? (
              <>
                <i className="fa fa-spinner fa-spin"></i> Procesando...
              </>
            ) : (
              "Registrarse"
            )}
          </button>
           <button 
                  onClick={(e) => {
                   e.preventDefault(); // evita que el formulario se envíe
                      toggleLogin();
                                          }}
                  className="login-button">
                    Iniciar Sesión
                  </button>  
          {/* ... botón de login ... */}
        </div>
        
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </form>
    </div>    );
  }
}

export default FormularioRegistro;

