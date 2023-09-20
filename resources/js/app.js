require('./bootstrap');

import { createRoot } from 'react-dom/client';
import App from './Layout/App';

const root = createRoot(document.getElementById('app'));
root.render(<App />);
