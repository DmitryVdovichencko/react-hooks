import * as React from 'react';
// if we pass object it should contains serialize, deserialize methods by deafult
function useLocalStorageState(key, defaultValue = '',  {
	serialize = JSON.stringify,
	deserialize = JSON.parse
} = {}) {

	const [ state, setState ] = React.useState(() => {
		const valueInLocalStorage = window.localStorage.getItem(key);
		if(valueInLocalStorage){
			// deserializing value from LocalStorage to see it without ""
			return deserialize(valueInLocalStorage)
		}else{
			// check if we have computational defaultValue
			return typeof defaultValue === 'function' ? defaultValue(): defaultValue;
		}
	});
	// we don't want rerender for this value
	const prevKeyRef = React.useRef(key);
	React.useEffect(() => {
		// getting previous key value
		const prevKey = prevKeyRef.current;
		if(prevKey !== key){
			window.localStorage.removeItem(prevKey);
		}
		// update previous key value
		prevKeyRef.current = key;
		// using JSON.stringify to write different types to localStorage
		window.localStorage.setItem(key, serialize(state))
	}, [key, serialize, state]);

	return [ state, setState ]
};

function Greeting({initialName = ''}) {

	const [name, setName] = useLocalStorageState('name', initialName);
  function handleChange(event) {
    setName(event.target.value)
  };

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
