import React, { Component } from "react";
import axios from "axios";
import "./FormularioRegistro.css";

class FormularioRegistro extends Component {
  state = {
    nombre: "",
    email: "",
    password: "",
    error: "",
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { nombre, email, password } = this.state;

    try {
      const response = await axios.post("http://localhost:3000/api/auth/register", {
        nombre,
        email,
        password,
      });

      // Guardar token en localStorage
      localStorage.setItem("token", response.data);

      // Mostrar mensaje y cerrar el formulario
      alert(`Registro exitoso. Bienvenido, ${response.data.nombre}!`);
    } catch (error) {
      this.setState({ error: "Error en el registro. Intenta de nuevo." });
    }
  };

  render() {
    const { email, password, error } = this.state;
    const { toggleLogin, setRegistro, setLogin } = this.props;
    return (
      <div className="formulario-container">

          <form className="formulario-register" onSubmit={this.handleSubmit}>
            <h1 className="register-title">Registrarse</h1>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              className="input"
              value={this.state.nombre}
              onChange={this.handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Correo Electrónico"
              className="input"
              value={email}
              onChange={this.handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              className="input"
              value={password}
              onChange={this.handleChange}
              required
            />
            <div className="botones-container">
              <button type="submit" className="registrar">
              Registrarse
            </button>
            <button 
                onClick={(e) => {
                     e.preventDefault(); // evita que el formulario se envíe
                         toggleLogin();
                                    }}
                  className="login-button">
                           Iniciar sesión
                                  </button>

           


            </div> 
                        {error && <p className="error-message">{error}</p>}
          </form>
        
      </div>
    );
  }
}

export default FormularioRegistro;

