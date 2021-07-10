// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'
import {ErrorBoundary} from 'react-error-boundary'
function PokemonInfo({pokemonName}) {
	const [state, setState] = React.useState({ pokemon:null, status:'idle', error:null });
  React.useEffect(() => {
    if (pokemonName) {
			setState({ pokemon:null, status:'pending', error:null});
      fetchPokemon(pokemonName).then(
        pokemonData => {
					setState({ pokemon: pokemonData, status:'resolved', error:null });
				},
        error => {
					setState({ pokemon:null, status:'rejected', error });
				},
      )
    }
    return () => {
      setState({ pokemon:null, status:'idle', error:null })
    }
  }, [pokemonName])
	const { status, pokemon, error } = state;
	if (status === 'rejected') throw error
  return (
    <>
      { status === 'idle' && 'Submit a pokemon'}
      { status === 'pending' && <PokemonInfoFallback name={pokemonName} />}
      {	status === 'resolved' && <PokemonDataView pokemon={pokemon} />}
      {/* {	status === 'rejected' && (
        <div role="alert">
          There was an error:{' '}
          <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
        </div>
      )} */}
    </>
  )
}
// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false };
//   }

//   static getDerivedStateFromError(error) {
//     // Update state so the next render will show the fallback UI.
//     return { hasError: true };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.log(error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       // You can render any custom fallback UI
//       return <h1>Something went wrong.</h1>;
//     }

//     return this.props.children; 
//   }
// }

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
			<button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}
function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
				<ErrorBoundary resetKeys={[pokemonName]} onReset={()=> setPokemonName('')} FallbackComponent={ErrorFallback}>
        	<PokemonInfo pokemonName={pokemonName} />
				</ErrorBoundary>
      </div>
    </div>
  )
}

export default App
