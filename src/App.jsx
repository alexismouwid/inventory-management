import { useState } from 'react'
import MenuPrincipal from './components/MenuPrincipal'
import './App.css'

function App() {
const [actualizarLista, setActualizarLista] = useState(false);
  return (
    <>
       
      <div>
         <MenuPrincipal onActualizar={setActualizarLista} />     </div>
         </>
  )
}

export default App
