import logo from './logo.svg';
import './App.css';
import Oppilas from './Oppilas';

const Luokka = (props) => {
  return (
    <>
      <div>Luokan nimi:{props.luokka.nimi}</div>
       <div>Oppilaat:</div>

       <div>{props.luokka.oppilaat.map((oppilas,index) => <Oppilas dispatch={props.dispatch} kouluIndex={props.kouluIndex} oppilasIndex={index} luokkaIndex={props.luokkaIndex} oppilas={oppilas} tieto2={10} />)}</div> 
       <button onClick={()=>props.dispatch({type:"LISÄÄ_OPPILAS", payload:{luokkaIndex:props.luokkaIndex,kouluIndex:props.kouluIndex}})}>Lisää oppilas</button>
     </>
  );
}

export default Luokka;