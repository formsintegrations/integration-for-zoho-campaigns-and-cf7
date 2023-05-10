/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-undef */
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { isPro, trigger } from '../../../Config'
import { $flowStep, $newFlow } from '../../../GlobalStates'
import useFetch from '../../../hooks/useFetch'
import CloseIcn from '../../../Icons/CloseIcn'
import GetLogo from '../../../Utils/GetLogo'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import FormPlugin from '../../Triggers/FormPlugin'

export default function SelectTrigger() {
  const loaderStyle = {
    display: 'flex',
    height: '82vh',
    justifyContent: 'center',
    alignItems: 'center',
  }
  const { data, isLoading } = useFetch({ payload: {}, action: 'trigger/list' })
  const [allTriggers, setAllTriggers] = useState(data || {})
  const flowStep = useRecoilValue($flowStep)
  const [newFlow, setNewFlow] = useRecoilState($newFlow)
  const history = useHistory()
  useEffect(() => {
    if (isLoading) {
      return
    }

    setAllTriggers(data)
    console.log('data[trigger]', data.data[trigger], trigger)
    if (data && data.data && data.data[trigger]) {
      setTrigger(trigger)
    }
  }, [data])

  const searchInteg = (e) => {
    const { value } = e.target

    const filtered = Object.entries(data.data).filter((integ) => integ[1].name.toLowerCase().includes(value.toLowerCase())).reduce((prev, [key, values]) => ({ ...prev, [key]: values }), {})
    setAllTriggers({ success: true, data: filtered })
  }

  const setTrigger = (trigger) => {
    const tempConf = { ...newFlow }
    tempConf.triggered_entity = trigger
    tempConf.triggerDetail = data.data[trigger]
    setNewFlow(tempConf)
  }

  const removeTrigger = () => {
    history.push('/')
    // const tempConf = { ...newFlow }
    // delete tempConf.triggered_entity
    // setNewFlow(tempConf)
  }
  if (isLoading || typeof data?.data === 'string') {
    return (
      <Loader style={loaderStyle} />
    )
  }

  return (
    <>
      {
        newFlow.triggered_entity
          ? (
            <>
              <div role="button" className="btcd-inte-card flx-col flx-center flx-wrp mr-4 mt-3" tabIndex="0">
                <GetLogo name={newFlow.triggerDetail.name} />
                <div className="txt-center">
                  {newFlow.triggerDetail.name}
                </div>
                <button onClick={removeTrigger} className="icn-btn btcd-mdl-close" aria-label="modal-close" type="button"><CloseIcn size={16} stroke={3} /></button>
              </div>
              <div className="flx">
                {newFlow.triggerDetail.type === 'form' && flowStep === 1 && (
                  newFlow.triggerDetail.is_active
                    ? <FormPlugin /> :
                    <span>
                      {newFlow.triggerDetail.name} is not activated or installed.
                    </span>
                )}
              </div>
            </>
          ) : (
            <>
              <div className=" btcd-inte-wrp txt-center">
                <h2 className="mt-0">Please select a Trigger</h2>
                <input type="search" className="btcd-paper-inp w-5 mb-2" onChange={searchInteg} placeholder="Search Trigger..." style={{ height: '50%' }} />
                <div className="flx flx-center flx-wrp pb-3">
                  {allTriggers?.data && Object.keys(allTriggers?.data).sort().map((inte, i) => (
                    <div
                      key={`inte-sm-${i + 2}`}
                      onClick={() => !inte.disable && (isPro || !allTriggers?.data[inte]?.isPro) && setTrigger(inte)}
                      onKeyPress={() => !inte.disable && (isPro || !allTriggers?.data[inte]?.isPro) && setNewInteg(inte.type)}
                      role="button"
                      tabIndex="0"
                      className={`btcd-inte-card inte-sm mr-4 mt-3 ${inte.disable && (isPro || !allTriggers?.data[inte]?.isPro) && 'btcd-inte-dis'} ${(allTriggers?.data[inte]?.isPro && !isPro) && 'btcd-inte-pro'}`}
                    >
                      {(allTriggers?.data[inte]?.isPro && !isPro) && (
                        <div className="pro-filter">
                          <span className="txt-pro"><a href={proUrl} target="_blank" rel="noreferrer">{__('Premium')}</a></span>
                        </div>
                      )}
                      <GetLogo name={allTriggers?.data[inte].name} />
                      <div className="txt-center">
                        {allTriggers?.data[inte].name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )
      }
    </>
  )
}