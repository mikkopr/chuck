import logo from './logo.svg';
import './App.css';

const Oppilas = (props) => {
  return (
    <div>
      <div>{props.oppilas.nimi}
       <input type="text" onChange={(event)=>
        {props.dispatch({type:"OPPILAAN_NIMI_MUUTTUI",
        payload:
          {
          nimi:event.target.value,
          oppilasIndex:props.oppilasIndex,
          kouluIndex:props.kouluIndex,
          luokkaIndex:props.luokkaIndex}
          })}}  value = {props.oppilas.nimi}/>
  
      </div>
      <div>{props.tieto2}
      </div>
    </div>
  );
}

export default Oppilas;