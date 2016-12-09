import R from 'ramda'

import CalculateTariffButton from '../components/calculate-tariff-button/CalculateTariffButton'
import CalculateTariffModal from '../components/calculate-tariff-modal/CalculateTariffModal'
import { MODAL_KEY } from '../constants'

function buildFieldsOptions(formOptions) {
  const { directories: { layers }, values, fieldPath } = formOptions
  const layerKeyPath = [fieldPath[0], fieldPath[1], 'key']
  const layerKey = R.path(layerKeyPath, values)
  if (R.isNil(layerKey)) return []

  const layer = R.find(x => x.key === layerKey, layers)
  const attributes = layer && R.pickBy(value => value.type === 'Number', layer.attributes)
  return R.keys(attributes).map(key => ({ value: key, label: attributes[key].label }))
}

export default {
  form: {
    fields: [
      {
        key: 'layers',
        label: 'Список слоев',
        input: 'array',
        item: {
          fields: [
            { key: 'key', label: 'Слой', input: 'select', inputOptions: { options: 'layers' } },
            {
              key: 'ratioPropertyKey',
              label: 'Поле с коэффициентом (Числовое)',
              input: 'select',
              inputOptions: { options: buildFieldsOptions }
            }
          ]
        }
      }
    ]
  },
  components: [
    { component: CalculateTariffButton, position: 'cardBottom' },
    { component: CalculateTariffModal, position: 'modals', options: { key: MODAL_KEY } }
  ]
}
