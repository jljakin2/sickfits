import { useEffect, useState } from 'react';

export default function useForm(initial = {}) {
  // create a state object for our inputs
  const [inputs, setInputs] = useState(initial);

  // ===== NOTE: note needed for every implementation of this hook ======
  // this portion is specific to solving the bug where when we want to update a product and provide the existing initial data as the initial data for the state
  // everything works fine until we go to another product. instead we should watch for when the initial values are changing and update state accordingly
  const initialValues = Object.values(initial).join('');

  useEffect(() => {
    // this function runs when the things we are watching change
    setInputs(initial);
  }, [initialValues]);
  // =====================
  // ====================================

  function handleChange(e) {
    let { value, name, type } = e.target;

    // this is only necessary when input is supposed to be a number because every time react updates state
    // it turns it into a string
    if (type === 'number') {
      value = parseInt(value);
    }

    // only necessary if uploading files. you need to grab the first item in the array of files, and the best way to do that is to destructure the "value" variable from e.target.files
    // REMEMBER: when destructuring from arrays, if you had an array with three items you could grab the first two like this: [one, two] = array
    if (type === 'file') {
      [value] = e.target.files;
    }

    setInputs({
      // copy existing state
      ...inputs,
      // this syntax allows us to dynamically update the input that is changing based on the
      // e.target.name of the input that changes. then we just update its state to the current e.target.value
      [name]: value,
    });
  }

  function resetForm() {
    setInputs(initial);
  }

  function clearForm() {
    const blankState = Object.fromEntries(
      Object.entries(inputs).map(([key, value]) => [key, ''])
    );

    setInputs(blankState);
  }

  // return the things we want to surface from this custom hook
  return {
    inputs,
    handleChange,
    resetForm,
    clearForm,
  };
}
