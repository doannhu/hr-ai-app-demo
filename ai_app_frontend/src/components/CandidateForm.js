import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitCandidate } from '../api';
import { MULTIPLE_CHOICE_QUESTIONS, SHORT_ANSWER_QUESTIONS } from '../questionBank';

/**
 * CandidateForm renders a form for job applicants to input their name, phone number
 * and answer a predefined list of questions.  On submission the data is
 * posted to the backend API.  A clean and modern design is achieved with
 * simple flexbox layout and light colours defined in the CSS.
 */
const CandidateForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  // For multiple choice questions, track the selected option letter (A, B, C, D)
  const [mcAnswers, setMcAnswers] = useState(
    MULTIPLE_CHOICE_QUESTIONS.map(() => '')
  );
  // For short answer questions, track the text provided by the candidate
  const [saAnswers, setSaAnswers] = useState(
    SHORT_ANSWER_QUESTIONS.map(() => '')
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  // Handle change for multiple choice answers
  const handleMcChange = (index, value) => {
    const newMc = [...mcAnswers];
    newMc[index] = value;
    setMcAnswers(newMc);
  };

  // Handle change for short answer questions
  const handleSaChange = (index, value) => {
    const newSa = [...saAnswers];
    newSa[index] = value;
    setSaAnswers(newSa);
  };

  // Submit candidate information to API.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    // Basic validation: ensure name and phone are provided
    if (!name.trim() || !phone.trim()) {
      setError('Vui lòng nhập họ tên và số điện thoại.');
      return;
    }
    setSubmitting(true);
    try {
      // Construct payload
      const payload = {
        name,
        phone,
        answers: [
          // Combine multiple choice answers
          ...MULTIPLE_CHOICE_QUESTIONS.map((q, idx) => ({
            type: 'mc',
            id: q.id,
            question: q.question,
            selected: mcAnswers[idx],
          })),
          // Combine short answer responses
          ...SHORT_ANSWER_QUESTIONS.map((q, idx) => ({
            type: 'text',
            id: q.id,
            question: q.question,
            answer: saAnswers[idx],
          })),
        ],
      };
      await submitCandidate(payload);
      setSubmitted(true);
      // Optionally reset form after submission
      setName('');
      setPhone('');
      setMcAnswers(MULTIPLE_CHOICE_QUESTIONS.map(() => ''));
      setSaAnswers(SHORT_ANSWER_QUESTIONS.map(() => ''));
    } catch (err) {
      console.error(err);
      setError('Có lỗi xảy ra khi gửi đơn. Vui lòng thử lại sau.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="form-container">
        <h1>Cảm ơn!</h1>
        <p>Đơn ứng tuyển của bạn đã được gửi thành công.</p>
        <button className="primary" onClick={() => setSubmitted(false)}>
          Gửi đơn khác
        </button>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h1>Ứng tuyển vị trí bán hàng &amp; chăm sóc khách hàng</h1>
      <p>Vui lòng điền thông tin và trả lời các câu hỏi dưới đây.  Câu trả lời của bạn sẽ được hệ thống đánh giá.</p>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="name">Họ và tên</label>
          <input
            id="name"
            type="text"
            placeholder="Nhập họ và tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="phone">Số điện thoại</label>
          <input
            id="phone"
            type="tel"
            placeholder="Nhập số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <fieldset className="section">
          <legend>Câu hỏi trắc nghiệm</legend>
          {MULTIPLE_CHOICE_QUESTIONS.map((q, idx) => (
            <div className="field" key={q.id}>
              <label>{`${q.id}. ${q.question}`}</label>
              <div className="options">
                {q.options.map((opt, optIdx) => {
                  const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
                  return (
                    <label key={optIdx} className="option-label">
                      <input
                        type="radio"
                        name={`mc-${q.id}`}
                        value={letter}
                        checked={mcAnswers[idx] === letter}
                        onChange={(e) => handleMcChange(idx, e.target.value)}
                        required
                      />
                      <span>{`${letter}. ${opt}`}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </fieldset>
        <fieldset className="section">
          <legend>Câu hỏi tự luận</legend>
          {SHORT_ANSWER_QUESTIONS.map((q, idx) => (
            <div className="field" key={q.id}>
              <label htmlFor={`sa-${q.id}`}>{`${q.id}. ${q.question}`}</label>
              <textarea
                id={`sa-${q.id}`}
                rows={4}
                value={saAnswers[idx]}
                onChange={(e) => handleSaChange(idx, e.target.value)}
                required
              />
            </div>
          ))}
        </fieldset>
        <button className="primary" type="submit" disabled={submitting}>
          {submitting ? 'Đang gửi…' : 'Gửi đơn ứng tuyển'}
        </button>
      </form>
      <div className="footer">
        <p>Bạn là nhà tuyển dụng? <a href="/employer">Đăng nhập</a></p>
      </div>
    </div>
  );
};

export default CandidateForm;