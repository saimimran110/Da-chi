import { use, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useEffect } from 'react'
import axios from 'axios'
function App() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    axios.get('http://localhost:3000/')
      .then((response) => {
        console.log(response.data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
   } , [])
  return (
    <>
      
    </>
  )
}

export default App
