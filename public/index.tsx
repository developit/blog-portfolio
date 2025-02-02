import { h } from 'preact'
import { setup } from 'goober'
import {
  LocationProvider,
  Router,
  hydrate,
} from 'preact-iso'
import { toStatic } from 'hoofd/preact'
import Home from './pages/Home'
import NotFound from './pages/404'

setup(h)

export function App() {
  return (
    <LocationProvider>
      <div className="app">
        <Router>
          <Home path="/" />
          <NotFound default />
        </Router>
      </div>
    </LocationProvider>
  )
}

if (typeof window !== 'undefined') {
  hydrate(<App />, document.body)
}

export async function prerender(data) {
  const { default: ssr } = await import('preact-iso/prerender');
  const { extractCss } = await import('goober');

  const res = await ssr(<App {...data} />)
  res.html = `<style id="_goober"> ${extractCss()}</style>${res.html}`;
  res.html = `${res.html}<script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "e032b43ad8dd4e7797f9dc4d2afbce64"}'></script>`;

  const head = toStatic()
  const elements = new Set([
    ...head.links.map(props => ({ type: 'link', props })),
    ...head.metas.map(props => ({ type: 'meta', props })),
  ])

  return {
    ...res,
    head: {
      title: head.title,
      lang: head.lang,
      elements,
    },
  }
}

// @ts-ignore
if (module.hot) module.hot.accept(u => hydrate(<u.module.App />, document.getElementById('root')))
