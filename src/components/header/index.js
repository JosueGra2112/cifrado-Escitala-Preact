import { h, Component } from 'preact';

export default class TranspositionCipher extends Component {
  constructor() {
    super();
    this.state = {
      message: '',
      columns: 3,
      encryptedMessage: '',
      decryptedMessage: '',
    };
  }

  removeAccents = (input) => {
    return input.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  doTranspositionEncryption = (message, columns) => {
    let result = "";
    const messageWithoutSpaces = message.replace(/\s/g, '');
    for (let i = 0; i < columns; i++) {
      for (let j = i; j < messageWithoutSpaces.length; j += columns) {
        result += messageWithoutSpaces[j];
      }
    }
    let index = 0;
    for (let i = 0; i < message.length; i++) {
      if (message[i] === ' ') {
        result = result.slice(0, i) + ' ' + result.slice(i);
      }
    }
    return result;
  }

  doTranspositionDecryption = (ciphertext, columns) => {
    let result = "";
    const messageWithoutSpaces = ciphertext.replace(/\s/g, '');
    const rows = Math.ceil(messageWithoutSpaces.length / columns);
    const cols = columns;
    const matrix = new Array(rows);

    for (let i = 0; i < rows; i++) {
      matrix[i] = new Array(cols);
    }

    let index = 0;

    for (let j = 0; j < cols; j++) {
      for (let i = 0; i < rows; i++) {
        matrix[i][j] = messageWithoutSpaces[index];
        index++;
      }
    }

    index = 0;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (messageWithoutSpaces[index] === ' ') {
          result = result.slice(0, index) + ' ' + result.slice(index);
        } else {
          result += matrix[i][j];
        }
        index++;
      }
    }

    return result;
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleEncrypt = () => {
    const { message, columns } = this.state;
    const encryptedMessage = this.doTranspositionEncryption(message, columns);
    this.setState({ encryptedMessage });
  }

  handleDecrypt = () => {
    const { decryptedMessage, columns } = this.state;
    const decryptedResult = this.doTranspositionDecryption(decryptedMessage, columns);
    this.setState({ decryptedMessage: decryptedResult });
  }

  render() {
    return (
      <div>
        <h1>Cifrado de Transposición (Escítala)</h1>
        <label for="message">Mensaje:</label>
        <input type="text" id="message" name="message" value={this.state.message} onInput={this.handleInputChange} />
        <br />
        <label for="columns">Número de Columnas:</label>
        <input type="number" id="columns" name="columns" min="2" value={this.state.columns} onInput={this.handleInputChange} />
        <br />
        <br />
        <button onClick={this.handleEncrypt}>Cifrar</button>
        <br />
        <p>Resultado Cifrado:</p>
        <div id="result">{this.state.encryptedMessage}</div>

        <h2>Descifrar Mensaje</h2>
        <label for="decryptedMessage">Mensaje Cifrado:</label>
        <input type="text" id="decryptedMessage" name="decryptedMessage" value={this.state.decryptedMessage} onInput={this.handleInputChange} />
        <br />
        <br />
        <button onClick={this.handleDecrypt}>Descifrar</button>
        <br />
        <p>Resultado Descifrado:</p>
        <div id="decryptedResult">{this.state.decryptedMessage}</div>
      </div>
    );
  }
}
