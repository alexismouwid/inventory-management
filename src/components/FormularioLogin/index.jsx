import React, { Component } from "react";
import axios from "axios";
import "./FormularioLogin.css";

class FormularioLogin extends Component {
  state = {
    email: "",
    password: "",
    message: "",
    loading: false,
    success: ""
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

 handleSubmit = async (e) => {
  e.preventDefault();
  this.setState({ loading: true, message: "" }); // Resetear mensajes y activar loading

  const { email, password } = this.state;
  const { verificarSesion } = this.props;

  try {
    const response = await axios.post("https://back-inventory-mmanagement.onrender.com/api/auth/login", {
      email,
      password,
    });

    console.log("Respuesta de la API:", response.data);
    const { token, nombre } = response.data;

    if (!token || !nombre) {
      throw new Error("Respuesta inesperada del servidor");
    }

    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify({ nombre }));
    
    this.setState({ 
      success: `¡Bienvenido, ${nombre}!`,
      loading: false
    });

    // Redirección después de 2 segundos (para que se vea el mensaje)
    setTimeout(() => {
      verificarSesion();
      window.location.reload();
    }, 2000);

  } catch (error) {
    console.error("Error en la autenticación:", error);
    this.setState({ 
      message: error.response?.data?.message || "Usuario y/o contraseña incorrectos",
      loading: false
    });
  }
};
render() {
   const { email, password, message, loading, success } = this.state;
const { toggleRegistro } = this.props;
    return (
      <div className="formulario-container">
       

        
          <form className="formulario-login" onSubmit={this.handleSubmit}>
            <h1 className="login-title">  Iniciar sesión </h1>
            <input
              type="email"
              name="email"
              placeholder="Correo"
              className="input-personalizado"
              value={this.state.email}
              onChange={this.handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              className="input-personalizado"
              value={this.state.password}
              onChange={this.handleChange}
              required
            />
            {/* 🆕 Botones alineados */}
             <div className="botones-container">
          <button 
            type="submit" 
            className="entrar"
            disabled={loading} // Deshabilitar botón durante carga
          >
            {loading ? (
              <>
                <i className="fa fa-spinner fa-spin"></i> Iniciando...
              </>
            ) : (
              "Entrar"
            )}
          </button>
          
          <button 
            onClick={(e) => {
              e.preventDefault();
              toggleRegistro();
            }}
            className="register-button"
            // También deshabilitar durante carga
          >
            Registrarse
          </button>            
        </div>
        
        {message && <p className="error-message">{message}</p>}
        {success && <p className="success-message">{success}</p>}
      </form>
    </div>   
    );
  }
}

export default FormularioLogin;


