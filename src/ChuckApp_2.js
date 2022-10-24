
//import logo from './logo.svg';
import './App.css';
import { useState, useReducer, useEffect } from "react";
import axios from 'axios';

const initialState = {
    joke:{},
    fetchingJoke: false,
    firstFetch: true,
    failedToFetchJoke: false,
    jokeReceived: false,
    fetchButtonEnabled: false,
};

function reducer(state, action) {
    switch (action.type) {
        /*case 'FETCH_JOKE_CLICKED':
            console.log('FETCH_JOKE_CLICKED');
            return {...state, fetchJoke: true, failedToFetchJoke: false};*/
        case 'STARTED_TO_FETCH_JOKE':
            console.log('STARTED_TO_FETCH_JOKE');
            return {...state, fetchingJoke: true, jokeReceived: false, failedToFetchJoke: false, firstFetch: false};
        case 'JOKE_RECEIVED':
            console.log('JOKE_RECEIVED');
            return {...state, joke: action.payload, jokeReceived: true, fetchingJoke: false,failedToFetchJoke: false};
        case 'FAILED_TO_FETCH_JOKE':
            console.log('FAILED_TO_FETCH_JOKE');
            return {...state, errorMessage: action.payload, fetchingJoke: false, failedToFetchJoke: true};
        default:
        throw new Error("Action.type kentän arvoa ei tunnistettu");
    }
}

function ChuckApp_2() {
    const [appData, dispatch] = useReducer(reducer, {...initialState});
    const [fetchTimer, setFetchTimer] = useState(-1);

    useEffect( () => {
        //Fetch the first joke immediately
        if (appData.firstFetch) {
            fetchJoke();
        }
        else if (appData.jokeReceived || appData.failedToFetchJoke) {
            if (fetchTimer > -1) {
                clearTimeout(fetchTimer);
            }
            setFetchTimer( setTimeout( () => {
                fetchJoke();
            }, 10000));
        }
    }, [appData.jokeReceived, appData.failedToFetchJoke, appData.firstFetch]);

    async function fetchJoke() {
        dispatch({type:'STARTED_TO_FETCH_JOKE'});
        try {
            let result = await axios('https://api.chucknorris.io/jokes/random');
            //let result = await axios('https://localhost/foo');
            dispatch({type:'JOKE_RECEIVED', payload: result.data});
        }
        catch (error) {
            dispatch({type: 'FAILED_TO_FETCH_JOKE', payload: error.message});
        }
    }

    return (
    <div>
        {appData.fetchButtonEnabled &&
            <p>
                <input type='button' value='Tell a Joke'
                    onClick={(event) => dispatch({type: 'FETCH_JOKE_CLICKED'})}
                />
            </p>
        }
        <div>
            <div className='joke'>
                {appData.joke.value}
            </div>
            <p>
                {appData.fetchingJoke && 'Fetching a joke...'}
                {appData.failedToFetchJoke && 'Failed to fetch a joke: ' + appData.errorMessage}
            </p>
        </div>
    </div>
    );
}

export default ChuckApp_2;
