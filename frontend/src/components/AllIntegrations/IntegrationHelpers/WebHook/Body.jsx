import React, { useEffect } from 'react'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import CloseIcn from '../../../../Icons/CloseIcn'
import TrashIcn from '../../../../Icons/TrashIcn'
import { __ } from '../../../../Utils/i18nwrap'
import Button from '../../../Utilities/Button'
import TableCheckBox from '../../../Utilities/TableCheckBox'

function Body({ formFields, webHooks, setWebHooks, isInfo, setTab }) {
  useEffect(() => {
    const tmpConf = { ...webHooks }
    if (!tmpConf.body) {
      tmpConf.body = { type: '', data: [] }
      setWebHooks(tmpConf)
    }
    setTab(3)
  }, [])

  const handlePayload = (e, index) => {
    const tmpConf = { ...webHooks }
    tmpConf.body.data[index] = { ...tmpConf.body.data[index], [e.target.name]: e.target.value }
    setWebHooks(tmpConf)
  }

  const setFromField = (val, index) => {
    const tmpConf = { ...webHooks }
    tmpConf.body.data[index] = { ...tmpConf.body.data[index], value: val }
    setWebHooks(tmpConf)
  }
  const addParam = () => {
    const tmpConf = { ...webHooks }
    if (!tmpConf.body.data) {
      tmpConf.body.data = []
    }
    tmpConf.body.data.push({})
    setWebHooks(tmpConf)
  }
  const delParam = (id) => {
    const tmpConf = { ...webHooks }
    tmpConf.body.data.splice(id, 1)
    setWebHooks(tmpConf)
  }
  const handleContentType = (e) => {
    const tmpConf = { ...webHooks }
    tmpConf.body.type = e.target.value
    setWebHooks(tmpConf)
  }
  const getFormatedData = () => {
    const data = []
    formFields.map(({ name }) => {
      // tmpConf.body.data[index] = { ...tmpConf.body.data[index], value: val }
      data.push({ key: name, value: `\${${name}}` })
    })
    return data
  }
  const actionHandler = (e) => {
    const newConf = { ...webHooks }
    // {key: 'vxcv', value: '${display_name}'}
    const formatedData = getFormatedData()
    if (e.target.checked) {
      newConf.body.send_all_data = true
      newConf.body.data = formatedData
    } else {
      delete newConf?.body?.data
      delete newConf?.body?.send_all_data
    }
    setWebHooks({ ...newConf })
  }

  return (
    <div className="mt-2">
      <TableCheckBox isInfo={isInfo} checked={webHooks?.body?.send_all_data || false} onChange={actionHandler} className="wdt-200 mt-4 mr-2 mb-2" value="Send All Data" title={__('Send All Data')} />
      <div className="f-m">{__('Add Request Payload')}</div>
      <select name="method" onChange={handleContentType} defaultValue={webHooks?.body?.type} className="btcd-paper-inp w-8" disabled={isInfo}>
        <option>-- Select Content-Type --</option>
        <option value="application/json">application/json</option>
        <option value="multipart/form-data">multipart/form-data</option>
        <option value="application/x-www-form-urlencoded">application/x-www-form-urlencoded</option>
      </select>
      <div className="btcd-param-t-wrp mt-1">
        <div className="btcd-param-t">
          <div className="tr">
            <div className="td">{__('Key')}</div>
            <div className="td">{__('Value')}</div>
          </div>
          {webHooks.body?.data?.map((itm, childindx) => (
            <div className="tr" key={`fu-1${childindx * 3}`}>
              <div className="td">
                <input className="btcd-paper-inp p-i-sm" onChange={e => handlePayload(e, childindx)} name="key" type="text" value={itm.key} disabled={isInfo} />
              </div>
              <div className="td">
                <input className="btcd-paper-inp p-i-sm" onChange={e => handlePayload(e, childindx)} name="value" type="text" value={itm.value} disabled={isInfo} />
              </div>
              {!isInfo && (
                <div className="flx p-atn">
                  <Button onClick={() => delParam(childindx)} icn><TrashIcn size={16} /></Button>
                  <MultiSelect
                    options={formFields.map(f => ({ label: f.label, value: `\${${f.name}}` }))}
                    className="btcd-paper-drpdwn wdt-200 ml-2"
                    singleSelect
                    onChange={val => setFromField(val, childindx)}
                    defaultValue={itm.value}
                  />
                </div>
              )}
            </div>
          ))}
          {!isInfo && (
            <Button onClick={() => addParam(webHooks, setWebHooks)} className="add-pram" icn><CloseIcn size="14" className="icn-rotate-45" /></Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Body
