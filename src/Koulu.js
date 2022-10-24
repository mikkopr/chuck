import logo from './logo.svg';
import './App.css';
import Luokka from './Luokka'

const Koulu = (props) => {
  return (
    <>
      <div>Koulun nimi:{props.koulu.nimi}</div>
{/*       <input type="text" onChange={(event)=>{ props.koulunNimiMuuttui(event.target.value) }}  value = {props.koulu.nimi}/>
 */}
       <input type="text" onChange={event=>{ props.dispatch({type:"KOULUN_NIMI_MUUTTUI",payload:{index:props.kouluIndex,nimi:event.target.value} })}} value = {props.koulu.nimi}/>

      <div>Luokat:</div>
      <div>{props.koulu.luokat.map((luokka,index) => <Luokka dispatch={props.dispatch} kouluIndex = {props.kouluIndex} luokkaIndex = {index} luokka={luokka} />)}</div>
    </>
  );
}

export default Koulu;