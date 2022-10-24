import logo from './logo.svg';
import './App.css';
import { useState, useReducer, useEffect } from "react"
import axios from 'axios' // npm install axios , jos ei ole jo ladattu

function reducer(state, action) {
  switch (action.type) {
    case 'KATEGORIAT_NOUDETTU':
      return {...state, kategoriat:action.payload}
    case 'YYYY':
    default:
      throw new Error("Action.type kentän arvoa ei tunnistettu");
  }
}
function AppHuuto() {
  const [appData, dispatch] = useReducer(reducer, { kategoriat:[]});

  useEffect(() => {
    async function haeDataa() {
      let result = await axios('https://api.huuto.net/1.1/categories');
      dispatch({type:'KATEGORIAT_NOUDETTU',payload:result.data.categories})
      console.log(result.data.categories)
    }
    haeDataa();
  }, []);

  return (
    <div>{appData.kategoriat.map(item=><div>{item.title}</div>)}
      
    </div>
  );
}

export default AppHuuto;