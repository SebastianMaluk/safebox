import '../App.css'
import { Link } from 'react-router-dom'

function App() {
  return (
    <>
      <h1 className="pb-5 text-5xl">Sistemas Embebidos</h1>
      <nav>
        <Link
          to={'admin'}
          className="m-3 w-5 rounded bg-green-500 p-3 text-white"
        >
          Admin
        </Link>
        <Link
          to={'user'}
          className="m-3 w-5 rounded bg-green-500 p-3 text-white"
        >
          User
        </Link>
      </nav>
    </>
  )
}

export default App
