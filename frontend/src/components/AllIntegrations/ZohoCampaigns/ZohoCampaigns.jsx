import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useHistory, useParams } from 'react-router-dom'
import BackIcn from '../../../Icons/BackIcn'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveIntegConfig, setGrantTokenResponse } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import ZohoCampaignsAuthorization from './ZohoCampaignsAuthorization'
import { checkMappedFields, handleInput } from './ZohoCampaignsCommonFunc'
import ZohoCampaignsIntegLayout from './ZohoCampaignsIntegLayout'

function ZohoCampaigns({ formFields, setFlow, flow, allIntegURL }) {
  const history = useHistory()
  const { formID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [campaignsConf, setCampaignsConf] = useState({
    name: 'Zoho Campaigns',
    type: 'Zoho Campaigns',
    clientId: process.env.NODE_ENV === 'development' ? '1000.QROR7EKA42DN9M5T6DPX7ZZ514COUF' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? '7c2438a3b72c810202fdf2330476fb6ba637b58266' : '',
    list: '',
    field_map: [
      { formField: '', zohoFormField: '' },
    ],
  })

  useEffect(() => {
    window.opener && setGrantTokenResponse('zohoCampaigns')
  }, [])

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    if (!checkMappedFields(campaignsConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'integration-for-zoho-campaigns-and-cf7') })
      return
    }

    if (campaignsConf.list !== '' && campaignsConf.table !== '' && campaignsConf.field_map.length > 0) {
      setstep(3)
    }
  }
  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <ZohoCampaignsAuthorization
        formID={formID}
        campaignsConf={campaignsConf}
        setCampaignsConf={setCampaignsConf}
        step={step}
        setstep={setstep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ width: step === 2 && 900, height: step === 2 && 'auto' }}>
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

        <button
          onClick={() => nextPage(3)}
          disabled={campaignsConf.list === '' || campaignsConf.table === '' || campaignsConf.field_map.length < 1}
          className="btn f-right btcd-btn-lg green sh-sm flx"
          type="button"
        >
          {__('Next', 'integration-for-zoho-campaigns-and-cf7')}
          <BackIcn className="ml-1 rev-icn" />
        </button>

      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveIntegConfig(flow, setFlow, allIntegURL, campaignsConf, history, '', '', setIsLoading)}
        isLoading={isLoading}
        dataConf={campaignsConf}
        setDataConf={setCampaignsConf}
        formFields={formFields}
      />
    </div>
  )
}

export default ZohoCampaigns
