import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import Button from 'core/frontend/components/shared/button/Button'
import * as modalActions from 'core/frontend/actions/modal-actions'

import styles from './calculate-tariff-button.styl'
import { MODAL_KEY } from '../../constants'

const CalculateTariffButton = (props) => {
  const { feature, pluginConfig, onClick } = props
  // todo rm '|| []' after done plugin default values
  const layerConfig = (pluginConfig.layers || []).find(x => x.key === feature.properties.layer_key)
  if (layerConfig == null) return null

  return (
    <div className={ styles.container }>
      <Button onClick={ onClick }>Рассчет тарифа</Button>
    </div>
  )
}

CalculateTariffButton.propTypes = {
  feature: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired,
  pluginConfig: PropTypes.shape({
    layers: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string.isRequired
    }))
  }).isRequired,
  onClick: PropTypes.func.isRequired
}

export default connect(
  state => ({
    pluginConfig: state.pluginConfigs.tariffsCalculation
  }),
  (dispatch, props) => ({
    onClick: () => dispatch(modalActions.toggle(MODAL_KEY, true, { feature: props.feature }))
  })
)(CalculateTariffButton)
