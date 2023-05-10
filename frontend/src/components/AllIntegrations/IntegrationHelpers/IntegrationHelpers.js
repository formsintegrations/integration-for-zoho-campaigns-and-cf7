/* eslint-disable no-unused-expressions */
import toast from 'react-hot-toast'
import { api } from '../../../Config'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'
import { webhookIntegrations } from '../../../Utils/StaticData/webhookIntegrations'

export const checkWebhookIntegrationsExist = (entity) => {
  const integrations = webhookIntegrations
  return integrations.includes(entity)
}

export const saveIntegConfig = async (flow, setFlow, allIntegURL, confTmp, history, index, edit, setIsLoading) => {
  let action = 'flow/save'
  setIsLoading(true)
  const tmpConf = confTmp
  if (confTmp?.condition?.action_behavior !== 'cond') {
    tmpConf.condition = {
      action_behavior: '',
      actions: [{ field: '', action: 'value' }],
      logics: [
        { field: '', logic: '', val: '' },
        'or',
        { field: '', logic: '', val: '' },
      ],
    }
  }
  if (flow.triggered_entity === 'Elementor') {
    if (edit) {
      tmpConf.postId = flow?.flow_details?.postId ?? null
    } else {
      tmpConf.postId = flow?.triggerData?.postId ?? null
    }
  }

  const data = {
    name: confTmp.name,
    trigger: flow.triggered_entity,
    triggered_entity_id: flow?.triggerData?.formID ? flow.triggerData.formID : (flow.triggered_entity_id || 0),
    flow_details: tmpConf,
  }
  if (flow.id) {
    data.id = flow.id
  }

  if (checkWebhookIntegrationsExist(flow.triggered_entity)) {
    data.flow_details.fields = !edit ? flow?.triggerDetail?.data : flow?.flow_details?.fields
  }
  if (edit) {
    action = 'flow/update'
  }
  try {
    const res = await bitsFetch(data, action)
    if (!edit && res.success) {
      history.push(allIntegURL)
    }

    setIsLoading(false)
    return res
  } catch (e) {
    setIsLoading(false)
    return __('Failed to save integration')
  }
}

export const saveActionConf = async ({ flow, setFlow, allIntegURL, conf, history, index, edit, setIsLoading, setSnackbar }) => {
  let action = 'flow/save'
  setIsLoading && setIsLoading instanceof Function && setIsLoading(true)
  const tmpConf = conf

  if (flow.triggered_entity === 'Elementor') {
    if (edit) {
      tmpConf.postId = flow?.flow_details?.postId ?? null
    } else {
      tmpConf.postId = flow?.triggerData?.postId ?? null
    }
  }

  const data = {
    name: conf.name,
    trigger: flow.triggered_entity,
    triggered_entity_id: flow?.triggerData?.formID ? flow.triggerData.formID : (flow.triggered_entity_id || 0),
    flow_details: tmpConf,
  }
  if (flow.id) {
    data.id = flow.id
  }
  if (checkWebhookIntegrationsExist(flow.triggered_entity)) {
    data.flow_details.fields = !edit ? flow?.triggerDetail?.data : flow?.flow_details?.fields
  }
  if (edit) {
    action = 'flow/update'
  }
  try {
    await bitsFetch(data, action)
      .then(res => {
        if (!edit && res.success) {
          history.push(allIntegURL)
        }

        let msg = ''
        let msgType = 'success'
        if (res.data?.msg) {
          msg = res.data.msg
        } else if (res.success) {
          msg = edit ? __('Integration updated successfully') : __('Integration saved successfully')
        } else {
          msgType = 'error'
          msg = edit ? __('Failed to update integration') : __('Failed to save integration')
        }
        toast(msg, { type: msgType })

        setIsLoading && setIsLoading instanceof Function && setIsLoading(false)
        if (!edit) {
          setTimeout(() => {
            history.push(allIntegURL)
          }, 700)
        }
      })
  } catch (e) {
    setIsLoading && setIsLoading instanceof Function && setIsLoading(false)
    return __('Failed to save integration')
  }
}

export const setGrantTokenResponse = (integ) => {
  const grantTokenResponse = {}
  const authWindowLocation = window.location.href
  const queryParams = authWindowLocation.replace(`${window.opener.location.href}/redirect`, '').split('&')
  if (queryParams) {
    queryParams.forEach(element => {
      const gtKeyValue = element.split('=')
      if (gtKeyValue[1]) {
        // eslint-disable-next-line prefer-destructuring
        grantTokenResponse[gtKeyValue[0]] = gtKeyValue[1]
      }
    })
  }
  localStorage.setItem(`__${integ}`, JSON.stringify(grantTokenResponse))
  window.close()
}

export const handleAuthorize = (integ, ajaxInteg, scopes, confTmp, setConf, setError, setisAuthorized, setIsLoading, setSnackbar) => {
  if (!confTmp.dataCenter || !confTmp.clientId || !confTmp.clientSecret) {
    setError({
      dataCenter: !confTmp.dataCenter ? __('Data center cann\'t be empty') : '',
      clientId: !confTmp.clientId ? __('Client ID cann\'t be empty') : '',
      clientSecret: !confTmp.clientSecret ? __('Secret key cann\'t be empty') : '',
    })
    return
  }
  setIsLoading(true)
  const apiEndpoint = `https://accounts.zoho.${confTmp.dataCenter}/oauth/v2/auth?scope=${scopes}&response_type=code&client_id=${confTmp.clientId}&prompt=Consent&access_type=offline&redirect_uri=${encodeURIComponent(api?.base)}/redirect&state=${encodeURIComponent(window.location.href)}/redirect`
  const authWindow = window.open(apiEndpoint, integ, 'width=400,height=609,toolbar=off')
  const popupURLCheckTimer = setInterval(() => {
    if (authWindow.closed) {
      clearInterval(popupURLCheckTimer)
      let grantTokenResponse = {}
      let isauthRedirectLocation = false
      const bitformsZoho = localStorage.getItem(`__${integ}`)
      if (bitformsZoho) {
        isauthRedirectLocation = true
        grantTokenResponse = JSON.parse(bitformsZoho)
        localStorage.removeItem(`__${integ}`)
      }
      if (!grantTokenResponse.code || grantTokenResponse.error || !grantTokenResponse || !isauthRedirectLocation) {
        const errorCause = grantTokenResponse.error ? `Cause: ${grantTokenResponse.error}` : ''
        setSnackbar({ show: true, msg: `${__('Authorization failed')} ${errorCause}. ${__('please try again')}` })
        setIsLoading(false)
      } else {
        const newConf = { ...confTmp }
        newConf.accountServer = grantTokenResponse['accounts-server']
        tokenHelper(ajaxInteg, grantTokenResponse, newConf, setConf, setisAuthorized, setIsLoading, setSnackbar)
      }
    }
  }, 500)
}

const tokenHelper = (ajaxInteg, grantToken, confTmp, setConf, setisAuthorized, setIsLoading, setSnackbar) => {
  const tokenRequestParams = { ...grantToken }
  tokenRequestParams.dataCenter = confTmp.dataCenter
  tokenRequestParams.clientId = confTmp.clientId
  tokenRequestParams.clientSecret = confTmp.clientSecret
  tokenRequestParams.redirectURI = `${api?.base}/redirect`
  bitsFetch(tokenRequestParams, `${ajaxInteg}_generate_token`)
    .then(result => result)
    .then(result => {
      if (result && result.success) {
        const newConf = { ...confTmp }
        newConf.tokenDetails = result.data
        setConf(newConf)
        setisAuthorized(true)
        setSnackbar({ show: true, msg: __('Authorized Successfully') })
      } else if ((result && result.data && result.data.data) || (!result.success && typeof result.data === 'string')) {
        setSnackbar({ show: true, msg: `${__('Authorization failed Cause:')}${result.data.data || result.data}. ${__('please try again')}` })
      } else {
        setSnackbar({ show: true, msg: __('Authorization failed. please try again') })
      }
      setIsLoading(false)
    })
}

export const addFieldMap = (i, confTmp, setConf, uploadFields, tab) => {
  const newConf = { ...confTmp }
  if (tab) {
    uploadFields ? newConf.relatedlists[tab - 1].upload_field_map.splice(i, 0, {}) : newConf.relatedlists[tab - 1].field_map.splice(i, 0, {})
  } else {
    uploadFields ? newConf.upload_field_map.splice(i, 0, {}) : newConf.field_map.splice(i, 0, {})
  }

  setConf({ ...newConf })
}

export const delFieldMap = (i, confTmp, setConf, uploadFields, tab) => {
  const newConf = { ...confTmp }
  if (tab) {
    if (uploadFields) {
      if (newConf.relatedlists[tab - 1].upload_field_map.length > 1) {
        newConf.relatedlists[tab - 1].upload_field_map.splice(i, 1)
      }
    } else if (newConf.relatedlists[tab - 1].field_map.length > 1) {
      newConf.relatedlists[tab - 1].field_map.splice(i, 1)
    }
  } else if (uploadFields) {
    if (newConf.upload_field_map.length > 1) {
      newConf.upload_field_map.splice(i, 1)
    }
  } else if (newConf.field_map.length > 1) {
    newConf.field_map.splice(i, 1)
  }
  setConf({ ...newConf })
}

export const handleFieldMapping = (event, index, conftTmp, setConf, uploadFields, tab) => {
  const newConf = { ...conftTmp }

  if (tab) {
    if (uploadFields) newConf.relatedlists[tab - 1].upload_field_map[index][event.target.name] = event.target.value
    else newConf.relatedlists[tab - 1].field_map[index][event.target.name] = event.target.value
  } else if (uploadFields) newConf.upload_field_map[index][event.target.name] = event.target.value
  else newConf.field_map[index][event.target.name] = event.target.value

  if (event.target.value === 'custom') {
    if (tab) {
      newConf.relatedlists[tab - 1].field_map[index].customValue = ''
    } else newConf.field_map[index].customValue = ''
  }
  setConf({ ...newConf })
}

export const handleCustomValue = (event, index, conftTmp, setConf, tab) => {
  const newConf = { ...conftTmp }
  if (tab) {
    newConf.relatedlists[tab - 1].field_map[index].customValue = event.target.value
  } else {
    newConf.field_map[index].customValue = event.target.value
  }
  setConf({ ...newConf })
}
