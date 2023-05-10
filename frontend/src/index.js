/* eslint-disable no-undef */
import { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom'
import Loader from './components/Loaders/Loader'
import { assetsURL } from './Config'

const App = lazy(() => import('./App'))

if (assetsURL !== undefined) {
  // eslint-disable-next-line camelcase
  __webpack_public_path__ = `${assetsURL}/js/`
}

if (window.location.hash === '') {
  window.location = `${window.location.href}#/`
}

ReactDOM.render(
  <Suspense
    fallback={(
      <Loader
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '82vh',
        }}
      />
    )}
  >
    <App />
  </Suspense>,
  document.getElementById('frm-in-app'),
)