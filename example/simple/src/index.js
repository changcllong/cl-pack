import EXAMPLE from './simple';
import './style.scss';

const app = document.getElementById('app');

app.innerHTML = 'HELLO WORLD!';

app.appendChild(document.createTextNode(EXAMPLE));
