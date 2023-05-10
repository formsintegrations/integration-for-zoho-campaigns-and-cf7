/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable no-unused-expressions */
/* eslint-disable max-len */
import { lazy, memo, useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import Loader from '../components/Loaders/Loader'
import ConfirmModal from '../components/Utilities/ConfirmModal'
import MenuBtn from '../components/Utilities/MenuBtn'
import Modal from '../components/Utilities/Modal'
import SingleToggle2 from '../components/Utilities/SingleToggle2'
import SnackMsg from '../components/Utilities/SnackMsg'
import Table from '../components/Utilities/Table'
import { proUrl } from '../Config'
import useFetch from '../hooks/useFetch'
import bitsFetch from '../Utils/bitsFetch'
import { __ } from '../Utils/i18nwrap'

const Welcome = lazy(() => import('./Welcome'))

function AllIntegrations() {
  const { data, isLoading } = useFetch({ payload: {}, action: 'flow/list', method: 'get' })
  const [integrations, setIntegrations] = useState(!isLoading && data.success && data?.data?.integrations ? data.data.integrations : [])
  const [snack, setSnackbar] = useState({ show: false })
  const [confMdl, setconfMdl] = useState({ show: false, btnTxt: '' })
  const [proModal, setProModal] = useState({ show: false, msg: '' })
  const [cols, setCols] = useState([
    { width: 250, minWidth: 80, Header: __('Trigger'), accessor: 'triggered_entity' },
    { width: 250, minWidth: 80, Header: __('Action Name'), accessor: 'name' },
    { width: 200, minWidth: 200, Header: __('Created At'), accessor: 'created_at' },
    { width: 70, minWidth: 60, Header: __('Status'), accessor: 'status', Cell: value => <SingleToggle2 className="flx" action={(e) => handleStatus(e, value.row.original.id)} checked={Number(value.row.original.status) === 1} /> },
  ])

  console.log('isLoading, data', isLoading, data)
  useEffect(() => {
    !isLoading && data.success && data?.data?.integrations && setIntegrations(data.data.integrations)
  }, [data])

  useEffect(() => {
    const ncols = cols.filter(itm => itm.accessor !== 't_action' && itm.accessor !== 'status')
    ncols.push({ width: 70, minWidth: 60, Header: __('Status'), accessor: 'status', Cell: value => <SingleToggle2 className="flx" action={(e) => handleStatus(e, value.row.original.id)} checked={Number(value.row.original.status) === 1} /> })
    ncols.push({ sticky: 'right', width: 100, minWidth: 60, Header: 'Actions', accessor: 't_action', Cell: val => <MenuBtn id={val.row.original.id} name={val.row.original.name} index={val.row.id} del={() => showDelModal(val.row.original.id, val.row.index)} dup={() => showDupMdl(val.row.original.id, val.row.index)} /> })
    setCols([...ncols])
  }, [integrations])

  const handleStatus = (e, id) => {
    const status = e.target.checked
    const tmp = [...integrations]
    const integ = tmp.find(int => int.id === id)
    integ.status = status === true ? '1' : '0'
    setIntegrations(tmp)

    const param = { id, status }
    bitsFetch(param, 'flow/toggleStatus')
      .then(res => {
        toast.success(__(res.data))
      }).catch(() => {
        toast.error(__('Something went wrong'))
      })
  }

  const handleDelete = (id, index) => {
    const deleteLoad = bitsFetch({ id }, 'flow/delete').then(response => {
      if (response.success) {
        const tmpIntegrations = [...integrations]
        tmpIntegrations.splice(index, 1)
        setIntegrations(tmpIntegrations)
        return 'Integration deleted successfully'
      }
      return response.data
    })

    toast.promise(deleteLoad, {
      success: msg => msg,
      error: __('Error Occurred'),
      loading: __('delete...'),
    })
  }

  const handleClone = (id) => {
    const loadClone = bitsFetch({ id }, 'flow/clone').then(response => {
      if (response.success) {
        const newInteg = response.data
        const tmpIntegrations = [...integrations]
        const exist = tmpIntegrations.find(item => item.id === id)
        const cpyInteg = {
          id: newInteg.id,
          name: `duplicate of ${exist.name}`,
          triggered_entity: exist.triggered_entity,
          status: exist.status,
          created_at: newInteg.created_at,
        }
        tmpIntegrations.push(cpyInteg)
        setIntegrations(tmpIntegrations)
        return 'Integration clone successfully'
      }
      return response.data
    })

    toast.promise(loadClone, {
      success: msg => msg,
      error: __('Error Occurred'),
      loading: __('cloning...'),
    })
  }

  const setBulkDelete = useCallback(rows => {
    const rowID = []
    const flowID = []
    for (let i = 0; i < rows.length; i += 1) {
      rowID.push(rows[i].id)
      flowID.push(rows[i].original.id)
    }
    const bulkDeleteLoading = bitsFetch({ flowID }, 'flow/bulk-delete').then(response => {
      if (response.success) {
        const newData = [...integrations]
        for (let i = rowID.length - 1; i >= 0; i -= 1) {
          newData.splice(Number(rowID[i]), 1)
        }
        setIntegrations(newData)
        return 'Integration Deleted Successfully'
      }
      return response.data
    })

    toast.promise(bulkDeleteLoading, {
      success: msg => msg,
      error: __('Error Occurred'),
      loading: __('delete...'),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [integrations])

  const setTableCols = useCallback(newCols => { setCols(newCols) }, [])
  const closeConfMdl = () => {
    confMdl.show = false
    setconfMdl({ ...confMdl })
  }
  const showDelModal = (id, index) => {
    confMdl.action = () => { handleDelete(id, index); closeConfMdl() }
    confMdl.btnTxt = __('Delete')
    confMdl.btn2Txt = null
    confMdl.btnClass = ''
    confMdl.body = __('Are you sure to delete this Integration?')
    confMdl.show = true
    setconfMdl({ ...confMdl })
  }

  const showDupMdl = (formID) => {
    confMdl.action = () => { handleClone(formID); closeConfMdl() }
    confMdl.btnTxt = __('Clone')
    confMdl.btn2Txt = null
    confMdl.btnClass = 'blue'
    confMdl.body = __('Are you sure to clone this Integration ?')
    confMdl.show = true
    setconfMdl({ ...confMdl })
  }

  const loaderStyle = {
    display: 'flex',
    height: '82vh',
    justifyContent: 'center',
    alignItems: 'center',
  }

  const setAlrtMdl = () => {
    setProModal({ show: true, msg: 'Only one integration can be done in the free version.' })
  }

  if (isLoading) {
    return (
      <Loader style={loaderStyle} />
    )
  }

  return (
    <div id="all-forms">
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <ConfirmModal
        show={confMdl.show}
        body={confMdl.body}
        action={confMdl.action}
        close={closeConfMdl}
        btnTxt={confMdl.btnTxt}
        btn2Txt={confMdl.btn2Txt}
        btn2Action={confMdl.btn2Action}
        btnClass={confMdl.btnClass}
      />
      {integrations && integrations?.length ? (
        <>
          <div className="af-header flx flx-between">
            <h2>{__('Integrations')}</h2>
            <Link to="/flow/new" className="btn round btcd-btn-lg blue blue-sh">
              {__('Create Integration')}
            </Link>
          </div>
          <div className="forms">
            <Table
              className="f-table btcd-all-frm"
              height={500}
              columns={cols}
              data={integrations}
              rowSeletable
              resizable
              columnHidable
              setTableCols={setTableCols}
              setBulkDelete={setBulkDelete}
              search
            />
          </div>
        </>
      ) : <Welcome />}

      <Modal
        sm
        show={proModal.show}
        setModal={() => setProModal({ show: false })}
        title={__('Premium Feature')}
        className="pro-modal"
      >
        <h4 className="txt-center mt-5">
          {proModal.msg}
        </h4>
        <div className="txt-center">
          <a href={proUrl} target="_blank" rel="noreferrer"><button className="btn btn-lg blue" type="button">{__('Buy Premium')}</button></a>
        </div>

      </Modal>
    </div>
  )
}

export default memo(AllIntegrations)
