
//import logo from './logo.svg';
import './App.css';
import { useState, useReducer, useEffect } from "react";
import axios from 'axios';

const initialState = {
    joke:{},
    fetchJoke: false,
    failedToFetchJoke: false,
};

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_JOKE_CLICKED':
            console.log('FETCH_JOKE_CLICKED');
            return {...state, fetchJoke: true, failedToFetchJoke: false};
        case 'STARTED_TO_FETCH_JOKE':
            console.log('STARTED_TO_FETCH_JOKE');
            return {...state, fetchJoke: false, failedToFetchJoke: false};
        case 'JOKE_RECEIVED':
            console.log('JOKE_RECEIVED');
            return {...state, joke: action.payload, failedToFetchJoke: false};
        case 'FAILED_TO_FETCH_JOKE':
            console.log('FAILED_TO_FETCH_JOKE');
            return {...state, errorMessage: action.payload, failedToFetchJoke: true};
        default:
        throw new Error("Action.type kentän arvoa ei tunnistettu");
    }
}

function ChuckApp_1() {
    const [appData, dispatch] = useReducer(reducer, {...initialState});

    useEffect(() => {
        async function fetchData() {
            console.log('Starting to fetch');
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
        if (appData.fetchJoke) {
            fetchData();
        }
    }, [appData.fetchJoke]);

    return (
    <div>
        <p>
            <input type='button' value='Tell a Joke'
                onClick={(event) => dispatch({type: 'FETCH_JOKE_CLICKED'})}
            />
        </p>
        <div>
            {appData.fetchingJoke && 'Fetching a joke...'}
            {appData.failedToFetchJoke && 'Failed to fetch a joke: ' + appData.errorMessage}
            <div className='joke'>
                {appData.joke.value}
            </div>
        </div>
    </div>
    );
}

export default ChuckApp_1;
