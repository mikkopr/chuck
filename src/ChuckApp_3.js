
//import logo from './logo.svg';
import './App.css';
import { useState, useReducer, useEffect } from "react";
import axios from 'axios';

const STORAGE_KEY = 'chuck';

const initialState = {
    jokes:[],
    currentJokeIndex: 0,
    fetchingJoke: false,
    firstFetch: true,
    failedToFetchJoke: false,
    failedToSaveData: false,
    jokeReceived: false,
    fetchButtonEnabled: false,
    saveRequired: false
};

function reducer(state, action) {
    switch (action.type) {
        /*case 'FETCH_JOKE_CLICKED':
            console.log('FETCH_JOKE_CLICKED');
            return {...state, fetchJoke: true, failedToFetchJoke: false};*/
        case 'STARTED_TO_FETCH_JOKE':
            console.log('STARTED_TO_FETCH_JOKE');
            return {...state, fetchingJoke: true, jokeReceived: false, failedToFetchJoke: false, 
                failedToSaveData: false, firstFetch: false};
        case 'JOKE_RECEIVED':
        {
            console.log('JOKE_RECEIVED');
            const stateCopy = JSON.parse(JSON.stringify(state));
            //TODO: should not save duplicates
            stateCopy.jokes.push(action.payload);
            stateCopy.currentJokeIndex = stateCopy.jokes.length - 1;
            return {...stateCopy, jokeReceived: true, fetchingJoke: false, failedToFetchJoke: false,
                saveRequired: true};
        }
        case 'FAILED_TO_FETCH_JOKE':
        {
            console.log('FAILED_TO_FETCH_JOKE');
            const stateCopy = {...state};
            if (state.jokes.length > 0) {
                stateCopy.currentJokeIndex = Math.floor(Math.random() * state.jokes.length);
            }
            return {...stateCopy, errorMessage: action.payload, fetchingJoke: false, failedToFetchJoke: true};
        }
        case 'FAILED_TO_SAVE_DATA':
        {
            console.log('FAILED_TO_SAVE_DATA');
            return {...state, errorMessage: action.payload, failedToSaveData: true};
        }
        case 'INITIALIZE_APP_DATA':
            console.log('INITIALIZE_APP_DATA');
            const savedState = JSON.parse(JSON.stringify(action.payload));
            return {...savedState, fetchingJoke:false, firstFetch:true, failedToFetchJoke:false,
                failedToSaveData:false, jokeReceived:false, currentJokeIndex: 0, saveRequired: false};
        default:
        throw new Error("Action.type kentän arvoa ei tunnistettu");
    }
}

function ChuckApp_3() {
    const [appData, dispatch] = useReducer(reducer, {...initialState});
    const [fetchTimer, setFetchTimer] = useState(-1);
    const [stateInitialized, setStateInitialized] = useState(false);

    useEffect( () => {
        if (!stateInitialized) {
            setStateInitialized(true);
            const storedData = localStorage.getItem(STORAGE_KEY);
            if (storedData == null) {
                console.log("Initializing app: No saved data found in storage");
                const initialJsonData = JSON.stringify(initialState);
                localStorage.setItem(STORAGE_KEY, initialJsonData);
                dispatch({type: 'INITIALIZE_APP_DATA', payload: initialJsonData});
            }
            else {
                console.log("Initializing app: Uses saved data in storage");
                dispatch({type: 'INITIALIZE_APP_DATA', payload: JSON.parse(storedData)});
            }
        }
    }, [stateInitialized]);

    useEffect( () => {
        if (!stateInitialized)
            return;
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

            if (appData.saveRequired) {
                try {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
                }
                catch (error) {
                    dispatch({type: 'FAILED_TO_SAVE_DATA', payload: error.message});
                }
            }
        }
    }, [stateInitialized, appData.jokeReceived, appData.failedToFetchJoke, appData.firstFetch, 
        appData.saveRequired]);

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
                {appData.jokes.length > 0 &&  appData.jokes[appData.currentJokeIndex].value}
            </div>
            <p>
                {appData.fetchingJoke && 'Fetching a joke...'}
                {appData.failedToFetchJoke && 'Failed to fetch a joke: ' + appData.errorMessage}
                {appData.failedToSaveData && 'Failed to save jokes to local storage: ' + appData.errorMessage}
            </p>
        </div>
    </div>
    );
}

export default ChuckApp_3;
