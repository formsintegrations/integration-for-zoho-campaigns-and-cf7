/* eslint-disable-next-line no-undef */
import { useState } from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { __ } from '../Utils/i18nwrap'
import EditInteg from './AllIntegrations/EditInteg'
import IntegInfo from './AllIntegrations/IntegInfo'
import Log from './AllIntegrations/Log'
import NewInteg from './AllIntegrations/NewInteg'
import SnackMsg from './Utilities/SnackMsg'

function Integrations() {
  const [snack, setSnackbar] = useState({ show: false })
  const { path, url } = useRouteMatch()
  const allIntegURL = url

  return (
    <div className="btcd-s-wrp" id="btcd-settings-wrp">
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <Switch>
        <Route path={`${path}/new/:integUrlName`}>
          <NewInteg allIntegURL="/" />
        </Route>
        <Route exact path={`${path}/edit/:id`}>
          <EditInteg allIntegURL="/" />
        </Route>

        <Route exact path={`${path}/info/:id/:type`}>
          <IntegInfo allIntegURL={allIntegURL} />
        </Route>
        <Route exact path={`${path}/log/:id/:type`}>
          <Log allIntegURL="/" />
        </Route>
      </Switch>

    </div>
  )
}

export default Integrations
