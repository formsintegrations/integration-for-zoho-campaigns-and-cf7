/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import EditFormInteg from '../EditFormInteg'
import { checkWebhookIntegrationsExist, saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import EditWebhookInteg from '../EditWebhookInteg'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { checkMappedFields, handleInput } from './ZohoCampaignsCommonFunc'
import ZohoCampaignsIntegLayout from './ZohoCampaignsIntegLayout'

function EditZohoCampaigns({ allIntegURL }) {
  const history = useHistory()
  const { id, formID } = useParams()
  const [campaignsConf, setCampaignsConf] = useRecoilState($actionConf)
  const [flow, setFlow] = useRecoilState($newFlow)
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })
  const formFields = useRecoilValue($formFields)
  const saveConfig = () => {
    if (!checkMappedFields(campaignsConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'integration-for-zoho-campaigns-and-cf7') })
      return
    }

    saveActionConf({ flow, setFlow, allIntegURL, conf: campaignsConf, history, edit: 1, setIsLoading, setSnackbar })
  }

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-100 d-in-b">{__('Integration Name:', 'integration-for-zoho-campaigns-and-cf7')}</b>
        <input className="btcd-paper-inp w-7" onChange={e => handleInput(e, formID, campaignsConf, setCampaignsConf)} name="name" value={campaignsConf.name} type="text" placeholder={__('Integration Name...', 'integration-for-zoho-campaigns-and-cf7')} />
      </div>
      <br />
      <br />
      {!checkWebhookIntegrationsExist(flow.triggered_entity) && <EditFormInteg setSnackbar={setSnackbar} />}
      {checkWebhookIntegrationsExist(flow.triggered_entity) && <EditWebhookInteg setSnackbar={setSnackbar} />}
      <ZohoCampaignsIntegLayout
        formID={formID}
        formFields={formFields}
        handleInput={(e) => handleInput(e, formID, campaignsConf, setCampaignsConf, setIsLoading, setSnackbar)}
        campaignsConf={campaignsConf}
        setCampaignsConf={setCampaignsConf}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={campaignsConf.list === '' || campaignsConf.table === '' || campaignsConf.field_map.length < 1}
        isLoading={isLoading}
        dataConf={campaignsConf}
        setDataConf={setCampaignsConf}
        formFields={formFields}
      />
    </div>
  )
}

export default EditZohoCampaigns
