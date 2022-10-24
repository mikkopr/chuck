import logo from './logo.svg';
import './App.css';
import Koulu from './Koulu';
import { useState, useReducer, useEffect } from "react"
import Nappain from './Nappain';

let oppilas1 = { nimi: "Olli Oppilas" }

let oppilas2 = { nimi: "Mikko Mallikas" }
let oppilas3 = { nimi: "Kalle Kolmonen" }


let luokka1 = {
  nimi: "3A",
  opplaidenMäärä: 27,
  oppilaat: [oppilas1, oppilas3]
}

let luokka2 = {
  nimi: "2B",
  opplaidenMäärä: 24,
  oppilaat: [oppilas2]
}

let appiksenData = {
  koulut: [{
    oppilaidenMäärä: 100,
    luokat: [luokka1, luokka2]
  }],
  tallennetaanko: false,
  tietoAlustettu: false
}

function reducer(state, action) {
  switch (action.type) {

    case 'KOULUN_NIMI_MUUTTUI': {
      console.log("Koulun nimi muuttui", action)
      const tilaKopio = { ...state, tallennetaanko: true }
      tilaKopio.koulut[action.payload.index].nimi = action.payload.nimi
      return tilaKopio
    }

    case 'OPPILAAN_NIMI_MUUTTUI': {
      console.log("Oppilaan nimi muuttui", action)
      const tilaKopio = { ...state, tallennetaanko: true }
      tilaKopio.koulut[action.payload.kouluIndex].luokat[action.payload.luokkaIndex].oppilaat[action.payload.oppilasIndex].nimi = action.payload.nimi
      return tilaKopio
    }
    // STRICT MODE ON - tässä muodostetaan koko tilasta kopio, tukee concurrent modea
    // Vähän "krouvi" ratkaisu, mutta helppo 
    /*case 'LISÄÄ_OPPILAS': {
          console.log("Lisää oppilas", action)
          const kopio = JSON.parse(JSON.stringify(state))
          kopio.koulut[action.payload.kouluIndex].luokat[action.payload.luokkaIndex].oppilaat.push({nimi:"oletusnimioppilaalle tai tyhjä merkkijono tms"})
          return kopio
    }
     */
    // STRICT MODE OFF - tässä mutatoidaan tilaa eri "kierrosten" välillä (siis eri kerrat kun reducer funktiota kutsutaan)
    // luodaan vain pintakopio juuriobjektista, mutta lasten viittauksen viittailevat "vanhaan dataan" - toimii hyvin
    // tässä tenttiappista tehdessä, tässä kohtaa kurssia. Mutatointi viittaa tässä siihen, että palautettu data (returnin jälkeen)
    // sisältää muutoksia, vaikka juuriobjekti onkin uusi.

    // Tämä koodi ei toimi strict modessa, koska vaikka juuriobjekti on kopioitu, viittaavat "lapset" "vanhaan" dataan. React kuitenkin
    // tekee strict modessa toisen kutsun reduceriin vanhalla datalla (vanha viittaus), johon me olemme ekalla kierroksella lisänneet
    // jo yhden oppilaan 
    
    // Tämä johtuu siitä, että strict modessa toisen kierroksen reducer kutsussa käytetään samaa juuriobjektin viittausta
    // kuin mitä käytettiin ensimmäisellä kierroksella - olemme menneet ykköskierroksella muuttamaan objektia ja siksi
    // homma ei pelitä.
  
    case 'LISÄÄ_OPPILAS': {
      console.log("Lisää oppilas", action)
      const kopio = { ...state }
      kopio.koulut[action.payload.kouluIndex].luokat[action.payload.luokkaIndex].oppilaat.push({ nimi: "oletusnimioppilaalle" })
      return kopio
    }


    case 'LISÄÄ_KOULU': {
      console.log("Reduceria kutsuttiin", action)
      return { ...state, koulut: [...state.koulut, { nimi: "oletusnimi", luokat: [] }], tallennetaanko: true }
    }
    case 'PÄIVITÄ_TALLENNUSTILA':
      return { ...state, tallennetaanko: action.payload }

    case 'ALUSTA_DATA':
      return { ...action.payload, tietoAlustettu: true }


    default:
      throw new Error("reduceriin tultiin jännällä actionilla");
  }
}

function App() {

  const [appData, dispatch] = useReducer(reducer, appiksenData);

  useEffect(() => {
    let kouludata = localStorage.getItem('kouludata');
    if (kouludata == null) {
      console.log("Data luettiin vakiosta")
      localStorage.setItem('kouludata', JSON.stringify(appiksenData));
      dispatch({ type: "ALUSTA_DATA", payload: appiksenData })

    } else {
      console.log("Data luettiin local storagesta")

      dispatch({ type: "ALUSTA_DATA", payload: (JSON.parse(kouludata)) })
    }

  }, []);
  useEffect(() => {

    if (appData.tallennetaanko == true) {
      console.log("koulun nimi pitää tallentaa")
      console.log("koulu:", appData)

      localStorage.setItem('kouludata', JSON.stringify(appData));
      dispatch({ type: "PÄIVITÄ_TALLENNUSTILA", payload: false })
    }
  }, [appData.tallennetaanko]);


  return (
    <div>

      {appData.tietoAlustettu && appData.koulut.map((koulu, index) => <Koulu kouluIndex={index} koulu={koulu} dispatch={dispatch} />)}
      <button onClick={() => dispatch({ type: 'LISÄÄ_KOULU' })}>Lisää uus koulu</button>
    </div>
  );
}

export default App;
