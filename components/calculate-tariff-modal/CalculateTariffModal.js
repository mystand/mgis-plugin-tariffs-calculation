import React, { PropTypes } from 'react'
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'

import Modal from 'core/frontend/components/shared/modal/Modal'
import NumberInput from 'core/frontend/common/inputs/number/NumberInput'
import * as modalActions from 'core/frontend/actions/modal-actions'

import { MODAL_KEY } from '../../constants'

function calcValue(ratio, costs) {
  return ratio * costs
}

class CalculateTariffModal extends React.Component {
  constructor() {
    super()
    this.state = {
      costs: 0
    }
  }

  @autobind
  onCostsChange(e) {
    this.setState({ costs: parseInt(e.target.value, 10) })
  }

  render()  {
    const { pluginConfig, feature, onClose } = this.props
    const { costs } = this.state
    const layerConfig = (pluginConfig.layers || []).find(x => x.key === feature.properties.layer_key)
    if (layerConfig.ratioPropertyKey == null) {
      return (<Modal onClose={ onClose }>Необходимо указать поле коэффицента</Modal>)
    }

    const ratio = parseInt(feature.properties[layerConfig.ratioPropertyKey], 10)
    return (
      <Modal onClose={ onClose }>
        <NumberInput
          label='Введите затраты на вывоз на один километр, руб.'
          value={ costs }
          onChange={ this.onCostsChange }
        />
        <NumberInput
          disabled
          label='Среднестатистический тариф по МПС, руб./год'
          value={ calcValue(ratio, costs) }
        />
      </Modal>
    )
  }
}

CalculateTariffModal.propTypes = {
  onClose: PropTypes.func,
  feature: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired,
  pluginConfig: PropTypes.shape({
    layers: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string.isRequired
    })).isRequired
  }).isRequired
}

const form = reduxForm({
  form: 'printModal',
  fields: ['zoom', 'ratio']
})(CalculateTariffModal)

export default connect(
  state => ({
    pluginConfig: state.pluginConfigs.tariffsCalculation,
    feature: state.modal[MODAL_KEY].feature
  }),
  dispatch => ({
    onClose: () => dispatch(modalActions.toggle(MODAL_KEY, false))
  })
)(form)
