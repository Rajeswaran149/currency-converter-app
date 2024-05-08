import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Picker, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const exchangeRates = {
  USD: { EUR: 0.82, GBP: 0.73, JPY: 108.79 },
  EUR: { USD: 1.22, GBP: 0.89, JPY: 133.06 },
  GBP: { USD: 1.37, EUR: 1.12, JPY: 148.96 },
  JPY: { USD: 0.0092, EUR: 0.0075, GBP: 0.0067 }
};

const App = () => {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [error, setError] = useState('');
  const [convertedAmount, setConvertedAmount] = useState('');
  
  useEffect(() => {
    AsyncStorage.getItem('conversion').then(data => {
      if(data) {
        // console.log(data);
        const parsedData = JSON.parse(data);
        setAmount(parsedData.amount);
        setFromCurrency(parsedData.fromCurrency);
        setToCurrency(parsedData.toCurrency);
        setConvertedAmount(parsedData.convertedAmount);
      }
    });
  }, []);

  const convertCurrency = () => {
    if (!amount || isNaN(amount)) {
      setError('Please enter a valid amount');
      return '';
    } else {
      setError(null);
    }

    const convertedAmount = parseFloat(amount) * exchangeRates[fromCurrency][toCurrency];
    setConvertedAmount(convertedAmount.toFixed(2));
    AsyncStorage.setItem('conversion', JSON.stringify({ amount, fromCurrency, toCurrency, convertedAmount }));
  
    return convertedAmount.toFixed(2);
  };
// console.log("convertCurrency" ,convertCurrency);
// console.log("amount",amount);
// console.log("fromCurrency",fromCurrency);
// console.log("toCurrency",toCurrency);
  const clearFields = () => {
    setAmount('');
    setConvertedAmount('');
    setError('');
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter amount"
        value={amount}
        onChangeText={text => setAmount(text)}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Picker
        style={styles.picker}
        selectedValue={fromCurrency}
        onValueChange={(itemValue) => setFromCurrency(itemValue)}>
        {Object.keys(exchangeRates).map(currency => (
          <Picker.Item key={currency} label={currency} value={currency} />
        ))}
      </Picker>
      <Text style={styles.equalSign}>=</Text>
      <TextInput
        style={styles.input}
        placeholder="Converted amount"
        value={convertedAmount}
        // onChangeText={text =>setConvertedAmount(convertCurrency)}
        onFocus={text =>setConvertedAmount(convertCurrency)}
 
        editable={true}

      />
      <Picker
        style={styles.picker}
        selectedValue={toCurrency}
        onValueChange={(itemValue) => setToCurrency(itemValue)}>
        {Object.keys(exchangeRates[fromCurrency]).map(currency => (
          <Picker.Item key={currency} label={currency} value={currency} />
        ))}
      </Picker>
      <TouchableOpacity onPress={swapCurrencies} style={styles.button}>
        <Text style={styles.buttonText}>Swap Currencies</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={clearFields} style={[styles.button, { backgroundColor: 'red' }]}>
        <Text style={styles.buttonText}>Clear</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  picker: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  equalSign: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default App;