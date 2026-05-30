import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import Loader from '../../components/Loader';
import EnhancedSurveyRenderer from '../../components/survey/EnhancedSurveyRenderer';
import { fetchStudentSurvey, submitStudentSurvey } from '../../services/surveyApi';
import { redirectToReturnUrl } from '../../utils/returnUrl';

const DEFAULT_DIFFICULTY_OPTIONS = ['Very Easy', 'Easy', 'Moderate', 'Difficult', 'Very Difficult'];

export default function AfterExamSurvey() {
  const { examId } = useParams();
  const [surveyData, setSurveyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [questionReviews, setQuestionReviews] = useState({});

  const goToResult = useCallback(() => {
    redirectToReturnUrl('/result');
  }, []);

  const canRenderPostSurvey = useCallback((payload) => {
    const template = payload?.template;
    const hasTemplateQuestions = Boolean(template?.questions?.length);
    const hasQuestionReview = Boolean(
      template?.questionReviewConfig?.enabled && payload?.examQuestions?.length
    );

    return Boolean(template && (hasTemplateQuestions || hasQuestionReview));
  }, []);

  useEffect(() => {
    const loadSurvey = async () => {
      try {
        const res = await fetchStudentSurvey(examId, 'postExam');

        if (res.data?.alreadySubmitted) {
          goToResult();
          return;
        }

        if (!canRenderPostSurvey(res.data)) {
          toast.info('Post-exam survey is not configured. Opening result.');
          goToResult();
          return;
        }

        setSurveyData(res.data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load survey');
        goToResult();
      } finally {
        setLoading(false);
      }
    };

    if (examId) {
      loadSurvey();
    }
  }, [canRenderPostSurvey, examId, goToResult]);

  const questionReviewConfig = surveyData?.template?.questionReviewConfig || {};

  const difficultyOptions = useMemo(() => {
    return questionReviewConfig.difficultyOptions?.length
      ? questionReviewConfig.difficultyOptions
      : DEFAULT_DIFFICULTY_OPTIONS;
  }, [questionReviewConfig.difficultyOptions]);

  const updateQuestionReview = (questionId, patch) => {
    setQuestionReviews((old) => ({
      ...old,
      [questionId]: {
        difficulty: '',
        reviewText: '',
        ...(old[questionId] || {}),
        ...patch,
      },
    }));
  };

  const handleSubmit = async (values) => {
    try {
      const answers = Object.entries(values).map(([fieldName, value]) => ({
        fieldName,
        value,
      }));

      const questionReviewsPayload = (surveyData.examQuestions || []).map((question) => ({
        questionId: question._id,
        difficulty: questionReviews[question._id]?.difficulty || difficultyOptions[2] || 'Moderate',
        reviewText: questionReviews[question._id]?.reviewText || '',
      }));

      await submitStudentSurvey(examId, 'postExam', {
        surveyType: 'postExam',
        surveyTemplateId: surveyData.template._id,
        answers,
        questionReviews: questionReviewsPayload,
      });

      toast.success('Post-exam survey submitted');
      goToResult();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Survey submission failed');
    }
  };

  if (loading) return <Loader />;

  if (!surveyData?.template) {
    return (
      <div className="card">
        <h3>Post-exam survey unavailable</h3>
        <p className="muted">You can continue to your result.</p>
        <button type="button" onClick={goToResult}>
          View Result
        </button>
      </div>
    );
  }

  return (
    <EnhancedSurveyRenderer
      template={surveyData.template}
      submitButtonText="Submit Survey & View Result"
      onSubmit={handleSubmit}
      showProgress={true}
      autoSave={true}
      questionReviews={questionReviews}
      examQuestions={surveyData.examQuestions}
      questionReviewConfig={questionReviewConfig}
      onQuestionReviewChange={updateQuestionReview}
    />
  );
}
