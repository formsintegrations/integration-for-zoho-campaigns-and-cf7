import { lazy, Suspense, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { action } from '../../Config'
import { $actionConf, $formFields, $newFlow } from '../../GlobalStates'
import useFetch from '../../hooks/useFetch'
import { __ } from '../../Utils/i18nwrap'
import Loader from '../Loaders/Loader'
import SnackMsg from '../Utilities/SnackMsg'
console.log('action', action)
const appName = action.replace(' ', '')
const ActionToEdit = lazy(() => import(`./${appName}/Edit${appName}.jsx`))
const loaderStyle = {
  display: 'flex',
  height: '82vh',
  justifyContent: 'center',
  alignItems: 'center',
}

export default function EditInteg({ allIntegURL }) {
  const { id } = useParams()
  const { data, isLoading, isError } = useFetch({ payload: { id }, action: 'flow/get' })
  const [flow, setFlow] = useRecoilState($newFlow)
  const setActionConf = useSetRecoilState($actionConf)
  const setFormFields = useSetRecoilState($formFields)
  const [snack, setSnackbar] = useState({ show: false, msg: '' })
  useEffect(() => {
    if (!isLoading && !isError && data?.data?.integration) {
      if (data?.data?.integration?.fields?.length === 0) {
        setSnackbar({ show: true, msg: __('Trigger Form Is Deleted') })
      }
      setFlow(data.data?.integration)
      setActionConf(data.data?.integration?.flow_details)
      setFormFields(data.data?.integration?.fields || [])
    }
  }, [data])
  if (isLoading || isError) {
    return (
      <Loader style={loaderStyle} />
    )
  }

  if (!data.success) {
    return (
      <div style={loaderStyle}>
        {data.data}
      </div>
    )
  }

  const renderIntegrationAction = () => {
    if (action !== flow?.flow_details?.type) {
      return <>Invalid Action {flow?.flow_details?.type}</>
    }
    return (
      <Suspense
        fallback={<Loader className="g-c" style={{ height: '82vh' }} />}
      >
        <ActionToEdit allIntegURL={allIntegURL} formFields={flow?.triggerData?.fields} flow={flow} setFlow={setFlow} />
      </Suspense>
    );
  }

  return (
    <div>
      <div className="flx">
        <SnackMsg snack={snack} setSnackbar={setSnackbar} />
        <Link to={allIntegURL} className="btn btcd-btn-o-gray">
          <span className="btcd-icn icn-chevron-left" />
          &nbsp;Back
        </Link>
        <div className="w-10 txt-center" style={{ marginRight: '73px' }}>
          <b className="f-lg">{flow.flow_details?.type}</b>
          <div>{__('Integration Settings')}</div>
        </div>
      </div>
      {renderIntegrationAction()}
    </div>
  )
}