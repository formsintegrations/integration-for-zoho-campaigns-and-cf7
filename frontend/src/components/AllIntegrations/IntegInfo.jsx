/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-no-undef */
import { lazy, Suspense, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { action, api } from '../../Config'
import useFetch from '../../hooks/useFetch'
import { __ } from '../../Utils/i18nwrap'
import SnackMsg from '../Utilities/SnackMsg'

const Loader = lazy(() => import('../Loaders/Loader'))

const appName = action.replace(' ', '')
const dynamicModule = import(`./${appName}/${appName}Authorization.jsx`)

export default function IntegInfo() {
  const { id, type } = useParams()
  const [snack, setSnackbar] = useState({ show: false })
  const [integrationConf, setIntegrationConf] = useState({})
  const { data, isLoading, isError } = useFetch({ payload: { id }, action: 'flow/get', method: 'post' })
  const [Component, setComponent] = useState(null);
  useEffect(() => {
    dynamicModule.then((module) => {
      setComponent(() => module.default);
    });
  }, [])
  const getProps = () => {
    const props = getConfFromObjectPropKeys(Component)
    const filteredProps = {}
    if (props.length) {
      filteredProps[props[0]] = integrationConf
    }

    return filteredProps
  }
  useEffect(() => {
    if (!isError && !isLoading) {
      if (data?.success) {
        setIntegrationConf(data?.data?.integration.flow_details)
      } else {
        setSnackbar({ ...{ show: true, msg: __('Failed to integration info') } })
      }
    }
  }, [data])

  // route is info/:id but for redirect uri need to make new/:type
  // let location = window.location.toString()
  // const toReplaceInd = location.indexOf('/info')
  // location = window.encodeURI(`${location.slice(0, toReplaceInd)}/new/${type}`)
  const location = `${api?.base}/redirect`

  return (
    <>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="flx">
        <Link to="/" className="btn btcd-btn-o-gray">
          <span className="btcd-icn icn-chevron-left" />
          &nbsp;Back
        </Link>
        <div className="w-10 txt-center" style={{ marginRight: '73px' }}>
          <b className="f-lg">{type}</b>
          <div>{__('Integration Info')}</div>
        </div>
      </div>

      {/* <Suspense fallback={<Loader className="g-c" style={{ height: '82vh' }} />}>
        <IntegrationInfo />
      </Suspense> */}
      {
        Component ?
          integrationConf.type === action && <Component step={1} isInfo {...getProps()} />
          : <Loader className="g-c" style={{ height: '82vh' }} />
      }
    </>
  )
}


function getConfFromObjectPropKeys(func) {
  const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
  const OBJECT_PATTERN = /{([^}]+)}/;
  const fnStr = func.toString().replace(STRIP_COMMENTS, '');
  const objectMatch = fnStr.match(OBJECT_PATTERN);
  if (objectMatch === null) {
    return [];
  }
  return objectMatch[1]
    .split(',')
    .map(key => {
      const param = key.trim().split('.')
      return param.length > 1 ? param[1] : param[0]
    })
    .filter(key => key.endsWith("Conf") && !key.startsWith("set"));
}
