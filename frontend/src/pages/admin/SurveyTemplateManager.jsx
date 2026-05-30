import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import Loader from '../../components/Loader';
import SimpleSurveyTemplateForm from '../../components/survey/SimpleSurveyTemplateForm';
import { QUIZ_APP_URL } from '../../config/api';
import {
  createDefaultTemplates,
  fetchTemplates,
  removeSurveyTemplate,
  upsertTemplate,
} from '../../services/surveyApi';
import '../../styles/components/SimpleSurveyForm.css';
import { getReturnUrl } from '../../utils/returnUrl';

const SURVEY_TABS = [
  {
    key: 'preExam',
    label: 'Pre-Exam Survey Template',
    description: 'Configure questions students answer before starting the exam.',
  },
  {
    key: 'postExam',
    label: 'Post-Exam Survey Template',
    description: 'Configure questions students answer after submitting the exam.',
  },
];

const normalizeTemplatesResponse = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.templates)) return data.templates;
  return [];
};

export default function SurveyTemplateManager() {
  const { examId } = useParams();
  const [templates, setTemplates] = useState(null);
  const [activeTab, setActiveTab] = useState('preExam');
  const [loadingDefaults, setLoadingDefaults] = useState(false);
  const [savingTemplateId, setSavingTemplateId] = useState(null);
  const [removingTemplateId, setRemovingTemplateId] = useState(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const autoCreateHandled = useRef(false);

  const loadTemplates = useCallback(async () => {
    try {
      const response = await fetchTemplates(examId);
      setTemplates(normalizeTemplatesResponse(response.data));
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to load templates');
      setTemplates([]);
    }
  }, [examId]);

  useEffect(() => {
    if (examId) {
      loadTemplates();
    }
  }, [examId, loadTemplates]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (autoCreateHandled.current || templates === null || params.get('autoCreate') !== 'true') {
      return;
    }

    autoCreateHandled.current = true;

    const preExamEnabled = params.get('preExamEnabled') === 'true';
    const postExamEnabled = params.get('postExamEnabled') === 'true';

    const autoCreateTemplates = async () => {
      setLoadingDefaults(true);
      try {
        await createDefaultTemplates(examId, {
          preExamEnabled,
          postExamEnabled,
        });
        toast.success('Survey templates created');
        await loadTemplates();

        params.delete('autoCreate');
        params.delete('preExamEnabled');
        params.delete('postExamEnabled');
        const cleanQuery = params.toString();
        window.history.replaceState(
          {},
          document.title,
          `${window.location.pathname}${cleanQuery ? `?${cleanQuery}` : ''}`
        );
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Failed to create templates');
      } finally {
        setLoadingDefaults(false);
      }
    };

    autoCreateTemplates();
  }, [examId, loadTemplates, templates]);

  useEffect(() => {
    setShowRemoveConfirm(false);
  }, [activeTab]);

  const normalizedTemplates = useMemo(() => {
    return Array.isArray(templates) ? templates : [];
  }, [templates]);

  const activeTemplate = useMemo(() => {
    return normalizedTemplates.find((template) => template.surveyType === activeTab);
  }, [normalizedTemplates, activeTab]);

  const hasPreTemplate = normalizedTemplates.some((template) => template.surveyType === 'preExam');
  const hasPostTemplate = normalizedTemplates.some(
    (template) => template.surveyType === 'postExam'
  );

  const integrationLinks = useMemo(() => {
    const setupUrl = new URL(`/admin/exams/${examId}/survey-templates`, window.location.origin);
    const preSurveyUrl = new URL(`/student/exams/${examId}/before-survey`, window.location.origin);
    const postSurveyUrl = new URL(`/student/exams/${examId}/after-survey`, window.location.origin);
    const reportUrl = new URL(`/admin/exams/${examId}/survey-report`, window.location.origin);

    return {
      setup: setupUrl.toString(),
      pre: preSurveyUrl.toString(),
      post: postSurveyUrl.toString(),
      report: reportUrl.toString(),
      quizBack: getReturnUrl(),
    };
  }, [examId]);

  const copyLink = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success('Link copied');
    } catch (_error) {
      toast.info(value);
    }
  };

  const handleCreateDefault = async (type) => {
    setLoadingDefaults(true);

    try {
      await createDefaultTemplates(examId, {
        preExamEnabled: type === 'preExam',
        postExamEnabled: type === 'postExam',
      });

      toast.success(
        type === 'preExam'
          ? 'Pre-exam survey template created'
          : 'Post-exam survey template created'
      );

      setActiveTab(type);
      await loadTemplates();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to create template');
    } finally {
      setLoadingDefaults(false);
    }
  };

  const handleCreateBothDefaults = async () => {
    setLoadingDefaults(true);

    try {
      await createDefaultTemplates(examId, {
        preExamEnabled: true,
        postExamEnabled: true,
      });

      toast.success('Survey templates created');
      await loadTemplates();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to create templates');
    } finally {
      setLoadingDefaults(false);
    }
  };

  const handleSave = async (template) => {
    const templateToSave = template || activeTemplate;
    if (!templateToSave) return;

    setSavingTemplateId(templateToSave._id);

    try {
      await upsertTemplate(templateToSave._id, templateToSave);
      toast.success('Template saved');
      await loadTemplates();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to save template');
    } finally {
      setSavingTemplateId(null);
    }
  };

  const handleRemoveTemplate = async () => {
    if (!activeTemplate) return;

    setRemovingTemplateId(activeTemplate._id);

    try {
      await removeSurveyTemplate(activeTemplate._id);

      toast.success('Survey configuration removed');

      setTemplates((prev) =>
        (prev || []).filter((template) => template._id !== activeTemplate._id)
      );
      setShowRemoveConfirm(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to remove survey template');
    } finally {
      setRemovingTemplateId(null);
    }
  };

  if (templates === null) return <Loader />;

  const activeTabMeta = SURVEY_TABS.find((tab) => tab.key === activeTab);

  return (
    <div className="form-wide survey-template-manager">
      <div className="card">
        <div className="page-header">
          <div>
            <p className="eyebrow">External Survey Application</p>
            <h2>Manage Survey Interface</h2>
            <p className="muted">
              Configure pre-exam and post-exam surveys used by the Quiz application.
            </p>
          </div>

          <a className="text-link" href={integrationLinks.quizBack}>
            Back to Quiz App
          </a>
        </div>

        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-card-label">Pre Survey</span>
            <strong className="stat-card-value">
              {hasPreTemplate ? 'Configured' : 'Not Created'}
            </strong>
          </div>
          <div className="stat-card">
            <span className="stat-card-label">Post Survey</span>
            <strong className="stat-card-value">
              {hasPostTemplate ? 'Configured' : 'Not Created'}
            </strong>
          </div>
          <div className="stat-card">
            <span className="stat-card-label">Quiz App</span>
            <strong className="stat-card-value">{new URL(QUIZ_APP_URL).port || 'Linked'}</strong>
          </div>
        </div>
      </div>

      <div className="card survey-template-setup-card">
        <div>
          <h3>External Survey Links</h3>
          <p className="muted">
            These are the public routes the Quiz app can open with returnUrl and optional participantId query params.
          </p>
        </div>

        <div className="actions survey-template-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() => copyLink(integrationLinks.setup)}
          >
            Copy Setup Link
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={() => copyLink(integrationLinks.pre)}
          >
            Copy Pre Survey Link
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={() => copyLink(integrationLinks.post)}
          >
            Copy Post Survey Link
          </button>
          <a className="button-link" href={integrationLinks.report}>
            Open Survey Report
          </a>
        </div>
      </div>

      <div className="card">
        <div className="survey-template-tabs">
          {SURVEY_TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            const exists = tab.key === 'preExam' ? hasPreTemplate : hasPostTemplate;

            return (
              <button
                key={tab.key}
                type="button"
                className={`survey-template-tab ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <span>{tab.label}</span>
                <small>{exists ? 'Configured' : 'Not created'}</small>
              </button>
            );
          })}
        </div>
      </div>

      {!hasPreTemplate || !hasPostTemplate ? (
        <div className="card survey-template-setup-card">
          <div>
            <h3>Create Survey Templates</h3>
            <p className="muted">
              Create ready-to-use templates first. You can edit questions immediately after
              creation.
            </p>
          </div>

          <div className="actions survey-template-actions">
            {!hasPreTemplate && (
              <button
                type="button"
                className="secondary-button"
                onClick={() => handleCreateDefault('preExam')}
                disabled={loadingDefaults}
              >
                Create Pre Survey
              </button>
            )}

            {!hasPostTemplate && (
              <button
                type="button"
                className="secondary-button"
                onClick={() => handleCreateDefault('postExam')}
                disabled={loadingDefaults}
              >
                Create Post Survey
              </button>
            )}

            <button type="button" onClick={handleCreateBothDefaults} disabled={loadingDefaults}>
              {loadingDefaults ? 'Creating...' : 'Create Both'}
            </button>
          </div>
        </div>
      ) : null}

      <div className="card survey-template-session-header">
        <div>
          <p className="eyebrow">{activeTab === 'preExam' ? 'Before Exam' : 'After Exam'}</p>
          <h2>{activeTabMeta?.label}</h2>
          <p className="muted">{activeTabMeta?.description}</p>
        </div>

        {activeTemplate ? (
          <button
            type="button"
            className="danger-button"
            onClick={() => setShowRemoveConfirm(true)}
            disabled={removingTemplateId === activeTemplate._id}
          >
            Remove Configuration
          </button>
        ) : null}
      </div>

      {showRemoveConfirm && activeTemplate ? (
        <div className="card remove-confirm-box">
          <div>
            <h3>Remove survey configuration?</h3>
            <p className="muted">
              Existing submitted responses will stay in reports, but students will no longer see
              this survey.
            </p>
          </div>

          <div className="actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => setShowRemoveConfirm(false)}
              disabled={removingTemplateId === activeTemplate._id}
            >
              Cancel
            </button>

            <button
              type="button"
              className="danger-button"
              onClick={handleRemoveTemplate}
              disabled={removingTemplateId === activeTemplate._id}
            >
              {removingTemplateId === activeTemplate._id ? 'Removing...' : 'Yes, Remove'}
            </button>
          </div>
        </div>
      ) : null}

      {activeTemplate ? (
        <SimpleSurveyTemplateForm
          template={activeTemplate}
          onSave={handleSave}
          saving={savingTemplateId === activeTemplate._id}
        />
      ) : (
        <div className="card">
          <h3>
            {activeTab === 'preExam'
              ? 'Pre-exam template is not created yet'
              : 'Post-exam template is not created yet'}
          </h3>

          <p className="muted">Create this template to add survey questions for this section.</p>

          <button
            type="button"
            onClick={() => handleCreateDefault(activeTab)}
            disabled={loadingDefaults}
          >
            {loadingDefaults ? 'Creating...' : 'Create This Template'}
          </button>
        </div>
      )}
    </div>
  );
}
