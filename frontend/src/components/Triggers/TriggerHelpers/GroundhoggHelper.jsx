import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { __ } from '../../../Utils/i18nwrap'

const GroundhoggHelper = ({ flow, setFlowData }) => {
  const id = flow?.triggerData?.formID
  return (
    <div>
      {(id === '2' || id === '3')
        && (
          <>
            <h4>Select a Tag</h4>
            <MultiSelect
              className="msl-wrp-options"
              defaultValue={flow.triggerData?.selectedTag}
              options={flow?.triggerData?.allTag?.map(list => ({ label: list.tag_name, value: list.tag_id.toString() }))}
              onChange={(val) => setFlowData(val, 'selectedTag')}
              singleSelect
              style={{ width: '100%', minWidth: 300, maxWidth: 400 }}
            />

          </>
        )}
      <div />
    </div>
  )
}

export default GroundhoggHelper
