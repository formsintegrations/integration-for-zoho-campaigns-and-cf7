import { __ } from '../../Utils/i18nwrap'

export default function Note({ note }) {
  return (
    <div className="note">
      <h4 className="mt-0">Note</h4>
      <div className="note-text" dangerouslySetInnerHTML={{ __html: __(note, 'integration-for-zoho-campaigns-and-cf7') }} />
    </div>
  )
}
