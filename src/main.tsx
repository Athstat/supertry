import {scan} from "react-scan";

import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Sentry.init({
//   dsn: "https://edd4351604211158f5090f44afa67627@o4509354186702848.ingest.us.sentry.io/4509617556619264",
//   // Setting this option to true will send default PII data to Sentry.
//   // For example, automatic IP address collection on events
//   sendDefaultPii: true
// });

scan({
  enabled: true
})

// React Scan is used for checking how many times components rerender

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
);
