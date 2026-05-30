import React, { useEffect, useState } from 'react';
import RichTextEditor from '../RichTextEditor';

const QUESTION_TYPES = [
  { value: 'singleChoice', label: 'Single Choice', icon: '🔘' },
  { value: 'multiSelect', label: 'Multiple Select', icon: '☑️' },
  { value: 'text', label: 'Short Text', icon: '✍️' },
  { value: 'textarea', label: 'Paragraph', icon: '📄' },
  { value: 'rating', label: 'Rating', icon: '⭐' },
];

const DEFAULT_OPTIONS = {
  singleChoice: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
  multiSelect: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
  text: [],
  textarea: [],
  rating: [],
};

const normalizeQuestion = (question, index) => ({
  ...question,
  id: question.id || question._id || question.fieldName || `question_${index}`,
  type: question.type === 'paragraph' ? 'textarea' : question.type,
  options: question.options || [],
  order: Number.isInteger(question.order) ? question.order : index,
  config: question.config || (question.type === 'rating' ? { min: 1, max: 5, step: 1 } : {}),
});

export default function SimpleSurveyTemplateForm({ template, onSave, saving = false }) {
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (template) {
      setTitle(template.title || 'Survey');
      setDescription(template.description || '');
      setQuestions((template.questions || []).map(normalizeQuestion));
    } else {
      setTitle('Survey');
      setDescription('Please answer the following questions');
      setQuestions([]);
    }
  }, [template]);

  const addQuestion = (type) => {
    const timestamp = Date.now();
    const selectedType = QUESTION_TYPES.find((item) => item.value === type);
    const newQuestion = {
      id: String(timestamp),
      label: `New ${selectedType?.label || 'Question'}`,
      fieldName: `question_${timestamp}`,
      type,
      required: false,
      options: [...DEFAULT_OPTIONS[type]],
      order: questions.length,
      config: type === 'rating' ? { min: 1, max: 5, step: 1 } : {},
    };

    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const updated = [...questions];
    const options = [...(updated[questionIndex].options || [])];
    options[optionIndex] = value;
    updated[questionIndex] = { ...updated[questionIndex], options };
    setQuestions(updated);
  };

  const addOption = (questionIndex) => {
    const updated = [...questions];
    const options = [...(updated[questionIndex].options || [])];
    options.push(`Option ${options.length + 1}`);
    updated[questionIndex] = { ...updated[questionIndex], options };
    setQuestions(updated);
  };

  const removeOption = (questionIndex, optionIndex) => {
    const updated = [...questions];
    const options = [...(updated[questionIndex].options || [])];
    options.splice(optionIndex, 1);
    updated[questionIndex] = { ...updated[questionIndex], options };
    setQuestions(updated);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, questionIndex) => questionIndex !== index));
  };

  const handleDragStart = (event, index) => {
    event.dataTransfer.setData('text/plain', index);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (event, dropIndex) => {
    event.preventDefault();
    const dragIndex = Number(event.dataTransfer.getData('text/plain'));

    if (dragIndex === dropIndex) return;

    const draggedQuestion = questions[dragIndex];
    const newQuestions = [...questions];
    newQuestions.splice(dragIndex, 1);
    newQuestions.splice(dropIndex, 0, draggedQuestion);

    setQuestions(newQuestions.map((item, index) => ({ ...item, order: index })));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const cleanedQuestions = questions.map((item, index) => {
      const question = { ...item };
      delete question.id;

      return {
        ...question,
        type: question.type === 'paragraph' ? 'textarea' : question.type,
        label: question.label || `Question ${index + 1}`,
        fieldName: question.fieldName || `question_${index + 1}`,
        options: ['singleChoice', 'multiSelect'].includes(question.type)
          ? (question.options || []).filter(Boolean)
          : [],
        order: index,
      };
    });

    const updatedTemplate = {
      ...template,
      title,
      description,
      questions: cleanedQuestions,
    };

    onSave(updatedTemplate);
  };

  return (
    <div className="simple-survey-form">
      <form onSubmit={handleSubmit}>
        <div className="form-header">
          <div className="form-row">
            <input
              type="text"
              placeholder="Survey Title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="survey-title-input"
              required
            />
          </div>
          <div className="form-row">
            <textarea
              placeholder="Survey Description (optional)"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="survey-description-input"
              rows={2}
            />
          </div>
        </div>

        <div className="question-types">
          <h3>Add Questions</h3>
          <div className="type-buttons">
            {QUESTION_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => addQuestion(type.value)}
                className="type-button"
              >
                <span className="type-icon">{type.icon}</span>
                <span className="type-label">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="questions-list">
          {questions.map((question, index) => {
            const isChoiceType = ['singleChoice', 'multiSelect'].includes(question.type);
            const isRating = question.type === 'rating';

            return (
              <div
                key={question.id || question.fieldName || index}
                draggable
                onDragStart={(event) => handleDragStart(event, index)}
                onDragOver={handleDragOver}
                onDrop={(event) => handleDrop(event, index)}
                className="question-card"
              >
                <div className="question-header">
                  <div className="drag-handle">⋮⋮</div>
                  <div className="question-type-badge">
                    {QUESTION_TYPES.find((type) => type.value === question.type)?.icon}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="remove-question-btn"
                    aria-label="Remove question"
                  >
                    ×
                  </button>
                </div>

                <div className="question-label-editor">
                  <RichTextEditor
                    value={question.label}
                    onChange={(value) => updateQuestion(index, 'label', value)}
                    placeholder="Question text"
                  />
                </div>

                <div className="question-options">
                  {isChoiceType && (
                    <div className="options-list">
                      <div className="options-header">
                        <span>Options</span>
                        <button
                          type="button"
                          onClick={() => addOption(index)}
                          className="add-option-btn"
                        >
                          + Add Option
                        </button>
                      </div>

                      {(question.options || []).map((option, optionIndex) => (
                        <div key={`${question.id}-${optionIndex}`} className="option-row">
                          <span className="option-bullet">•</span>
                          <input
                            type="text"
                            value={option}
                            onChange={(event) =>
                              updateOption(index, optionIndex, event.target.value)
                            }
                            className="option-input"
                            placeholder="Option text"
                            required
                          />
                          {(question.options || []).length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeOption(index, optionIndex)}
                              className="remove-option-btn"
                              aria-label="Remove option"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {isRating && (
                    <div className="form-grid">
                      <label className="field-group">
                        <span>Minimum rating</span>
                        <input
                          type="number"
                          min="1"
                          value={question.config?.min || 1}
                          onChange={(event) =>
                            updateQuestion(index, 'config', {
                              ...(question.config || {}),
                              min: Number(event.target.value),
                            })
                          }
                        />
                      </label>
                      <label className="field-group">
                        <span>Maximum rating</span>
                        <input
                          type="number"
                          min="2"
                          value={question.config?.max || 5}
                          onChange={(event) =>
                            updateQuestion(index, 'config', {
                              ...(question.config || {}),
                              max: Number(event.target.value),
                            })
                          }
                        />
                      </label>
                    </div>
                  )}

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={question.required}
                      onChange={(event) => updateQuestion(index, 'required', event.target.checked)}
                    />
                    Required
                  </label>
                </div>
              </div>
            );
          })}
        </div>

        {questions.length === 0 && (
          <div className="empty-questions">
            <p>No questions added yet. Click any question type above to add one.</p>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" disabled={saving || questions.length === 0} className="save-btn">
            {saving ? 'Saving...' : 'Save Survey'}
          </button>
        </div>
      </form>
    </div>
  );
}
