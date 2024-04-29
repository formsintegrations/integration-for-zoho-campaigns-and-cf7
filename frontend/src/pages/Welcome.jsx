/* eslint-disable no-unused-vars */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Link } from 'react-router-dom'
import { __, sprintf } from '../Utils/i18nwrap'
import greeting from '../resource/img/welcomeBanner.svg'
import { action, appTitle, trigger } from '../Config'


export default function Welcome() {
  return (
    <div className="btcd-greeting">
      <img src={greeting} alt="Contact Form7-Zoho Campaigns integration banner" />
      <h2>{sprintf(__('Welcome to %s'), appTitle)}</h2>
      <div className="sub">
        {sprintf(__('You can easily send data %s to %s. Ensure that this plugin makes your life easier.'), trigger, action)}
      </div>
      <Link to="/flow/new" className="btn round btcd-btn-lg dp-blue">
        {__('Create Integration')}
      </Link>
    </div>
  )
}
