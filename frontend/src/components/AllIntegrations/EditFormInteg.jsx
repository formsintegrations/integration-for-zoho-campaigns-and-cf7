import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { $formFields, $newFlow } from '../../GlobalStates'
import bitsFetch from '../../Utils/bitsFetch'
import { __ } from '../../Utils/i18nwrap'

function EditFormInteg({ setSnackbar, className = '' }) {
  const [forms, setForms] = useState([])
  const [formPost, setFormPost] = useState([])
  const [flow, setFlow] = useRecoilState($newFlow)
  const setFormFields = useSetRecoilState($formFields)

  const handle = (e) => {
    const tmpInteg = { ...flow }
    const { name, value } = e.target
    tmpInteg[name] = value
    setFlow(tmpInteg)
    let queryData = { id: value }
    if (
      flow.triggered_entity === 'Elementor') {
      queryData = { ...queryData, postId: formPost[value] ?? flow.flow_details.postId }
    }

    const loadFormFields = bitsFetch(queryData, `${flow.triggered_entity.toLowerCase()}/get/form`).then((res) => {
      if (res.success) {
        setFormFields(res.data.fields)
      }
      return res.data
    })
    toast.promise(loadFormFields, {
      success: __('Form fields Refresh successfully'),
      error: __('Error Occurred'),
      loading: __('Loading Form Fields...'),
    })
  }

  useEffect(() => {
    bitsFetch({}, `${flow.triggered_entity.toLowerCase()}/get`, null, 'GET').then((res) => {
      if (res.success) {
        setForms(res.data)
        const tmpFormPost = {}
        res.data?.map((form) => {
          tmpFormPost[form.id] = form.post_id
        })
        setFormPost(tmpFormPost)
      }
    })
  }, [])
  return (
    <div className={`${className || 'flx'}`}>
      <b className="wdt-200 d-in-b">{__(' Form/Task Name ')}</b>
      <select name="triggered_entity_id" value={flow.triggered_entity_id} onChange={handle} className={`btcd-paper-inp w-7 ${className}`}>
        <option value="">{__('Select Form')}</option>
        {forms?.map((form) => (
          <option key={form.id} value={form.id}>
            {form.title}
          </option>
        ))}
      </select>
    </div>
  )
}

export default EditFormInteg
