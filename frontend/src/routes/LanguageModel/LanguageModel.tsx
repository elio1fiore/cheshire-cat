import React, { type FC, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { Form, Select } from 'antd'
import Alert from '@components/Alert'
import SidePanel from '@components/SidePanel'
import Spinner from '@components/Spinner'
import useLLMProviders from '@hooks/useLLMProviders'
import SchemaForm from '@components/SchemaForm'
import { type LLMSettings } from '@models/LLMSettings'
import routesDescriptor from '@routes/routesDescriptor'

import style from './LanguageModel.module.scss'

/**
 * Language Model configuration side panel
 */
const LanguageModel: FC = () => {
  const navigate = useNavigate()
  const {
    providers, error, isLoading, selectProvider, selected, schema, requireProviders, updateProviderSettings
  } = useLLMProviders()
  const options = providers.map((p) => ({ label: p.name_human_readable, value: p.languageModelName }))
  const title = 'Configure your language model'

  useEffect(() => {
    void requireProviders()
  }, [requireProviders])

  const handleOnClose = useCallback(() => {
    navigate(routesDescriptor.settings.path)
  }, [navigate])

  const handleSubmit = useCallback((data: LLMSettings) => {
    void updateProviderSettings(data)
  }, [updateProviderSettings])

  return (
    <SidePanel active title={title} onClose={handleOnClose} position="right">
      <div className={clsx(style.llmProvider, isLoading && style.loading)}>
        {isLoading && <Spinner />}
        {error && <Alert variant="error">{error}</Alert>}
        {!isLoading && !error && providers && (
          <Form name="llm" layout="vertical">
            <Form.Item label="Language Model Provider" name="provider" tooltip="Select your language model provider">
              <Select
                value={selected}
                defaultValue={selected}
                placeholder="Please select your language model provider"
                onChange={selectProvider}
                options={options}
              />
            </Form.Item>
          </Form>
        )}
        {selected && schema && (
          <SchemaForm onSubmit={handleSubmit} schema={schema} />
        )}
      </div>
    </SidePanel>
  )
}

export default LanguageModel
