import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import { dataRouter } from './routing/dataRoutes';

// Sentry.init({
//   dsn: "https://edd4351604211158f5090f44afa67627@o4509354186702848.ingest.us.sentry.io/4509617556619264",
//   // Setting this option to true will send default PII data to Sentry.
//   // For example, automatic IP address collection on events
//   sendDefaultPii: true
// });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={dataRouter}  />
);
