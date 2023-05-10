import { __ } from '../../../../Utils/i18nwrap'
import LoaderSm from '../../../Loaders/LoaderSm'

export default function WebHooksStepTwo({ saveConfig, edit, disabled, isLoading }) {
  return (
    edit
      ? (
        <div className="txt-center w-9 mt-3">
          <button onClick={saveConfig} className="btn btcd-btn-lg green sh-sm flx" type="button" disabled={disabled || isLoading}>
            {__('Save')}
            {isLoading && <LoaderSm size={20} clr="#022217" className="ml-2" />}
          </button>
        </div>
      )
      : (
        <div className="txt-center">
          <h2 className="ml-3">{__('Successfully Integrated')}</h2>
          <button onClick={saveConfig} className="btn btcd-btn-lg green sh-sm" type="button" disabled={isLoading}>
            {__('Finish & Save ')}
            ✔
            {isLoading && <LoaderSm size={20} clr="#022217" className="ml-2" />}
          </button>
        </div>
      )
  )
}
