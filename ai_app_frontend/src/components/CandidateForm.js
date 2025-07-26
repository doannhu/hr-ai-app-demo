import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitCandidate } from '../api';

// Multiple choice questions taken from the attached guide.  Each question
// includes a text and four answer options.  Correct answers are not shown to
// the candidate; the selected option letter will be sent to the backend for
// evaluation.
const MULTIPLE_CHOICE_QUESTIONS = [
  {
    id: 1,
    question: 'Bạc 925 có nghĩa là:',
    options: ['Bạc giả', '92.5% là bạc nguyên chất', 'Mã sản phẩm', 'Bạc nhập khẩu'],
  },
  {
    id: 2,
    question: 'Ưu điểm của bạc 925 so với bạc ta:',
    options: ['Không bị xỉn màu', 'Cứng hơn, giữ dáng tốt', 'Nhẹ hơn', 'Đắt hơn'],
  },
  {
    id: 3,
    question: 'Khi khách nói “Giá này mắc quá”, bạn nên:',
    options: ['Không nói gì', 'Giải thích về chất lượng và bảo hành', 'Gật đầu đồng ý', 'Nói khách đi chỗ khác'],
  },
  {
    id: 4,
    question: 'Sản phẩm nào thường dùng làm quà đầy tháng cho bé:',
    options: ['Dây chuyền mặt đá', 'Vòng tay, vòng chân, lắc bạc', 'Nhẫn hột', 'Bông tai'],
  },
  {
    id: 5,
    question: 'Tình huống nào dưới đây nên đổi hàng cho khách:',
    options: ['Khách đeo không hợp', 'Sản phẩm lỗi', 'Khách thích mẫu khác hơn', 'Khách không ưng'],
  },
  {
    id: 6,
    question: 'Khách hàng đến chỉ để “xem thử”, bạn nên:',
    options: ['Không tiếp', 'Chào hỏi vui vẻ, hỗ trợ nhẹ nhàng', 'Kệ khách', 'Ép mua'],
  },
  {
    id: 7,
    question: 'Lý do khách hàng chọn bạc:',
    options: ['Dễ phối đồ, giá hợp lý, có giá trị', 'Vì vàng quá đắt', 'Vì theo trend', 'Không rõ'],
  },
  {
    id: 8,
    question: 'Trang sức nào thường được khách nam chọn:',
    options: ['Bông tai', 'Lắc Cuban, dây xích to', 'Vòng đá', 'Nhẫn đính hột'],
  },
  {
    id: 9,
    question: 'Cách giữ bạc sáng màu tốt nhất:',
    options: ['Lau sạch sau khi đeo', 'Ngâm nước', 'Để vào tủ lạnh', 'Đánh bằng bàn chải'],
  },
  {
    id: 10,
    question: 'Nếu khách hàng hỏi: “Có ship COD không?” bạn trả lời:',
    options: ['Không biết', 'Có/không tùy theo chính sách, và giải thích rõ', 'Để hỏi sau', 'Bảo khách hỏi Zalo'],
  },
  {
    id: 11,
    question: 'Khi livestream, điều quan trọng nhất là:',
    options: ['Giọng rõ, hình sáng, giới thiệu cụ thể', 'Nói nhanh cho xong', 'Có người xem là được', 'Chỉ cần quay sản phẩm đẹp'],
  },
  {
    id: 12,
    question: 'Nếu khách hỏi về bảo hành bạc, bạn nên:',
    options: ['Né câu trả lời', 'Giải thích rõ chính sách làm sáng/gắn hột miễn phí', 'Nói “Tùy”', 'Bảo khách hỏi sau'],
  },
  {
    id: 13,
    question: 'Lý do khiến khách trung thành:',
    options: ['Giá rẻ nhất', 'Có chương trình khuyến mãi', 'Dịch vụ tốt, tư vấn nhiệt tình', 'Có bạn bè làm'],
  },
  {
    id: 14,
    question: 'Một cửa hàng tốt cần có:',
    options: ['Sản phẩm chất lượng + nhân viên thân thiện', 'Trang trí đẹp', 'Giá rẻ', 'Tên sang'],
  },
  {
    id: 15,
    question: 'Nếu bạn làm hỏng sản phẩm khi gói, bạn nên:',
    options: ['Lặng lẽ giấu', 'Báo ngay để xử lý', 'Trả khách rồi nói “do vận chuyển”', 'Tự đền'],
  },
  {
    id: 16,
    question: 'Khách nhắn inbox nhưng chưa trả lời được, bạn nên:',
    options: ['Để đó', 'Xin phép trả lời sau + ghi chú để quay lại', 'Nhờ người khác trả lời', 'Chặn tin nhắn'],
  },
  {
    id: 17,
    question: 'Khi tư vấn, bạn nên làm gì trước tiên:',
    options: ['Hỏi ngân sách', 'Hỏi mục đích mua và người nhận', 'Đưa bảng giá', 'Đọc tên sản phẩm'],
  },
  {
    id: 18,
    question: 'Màu da ngăm có hợp đeo bạc không?',
    options: ['Có, bạc làm nổi bật tông da', 'Không, bạc chỉ hợp da trắng', 'Tùy người', 'Nên chọn vàng'],
  },
  {
    id: 19,
    question: 'Đơn hàng online bị giao trễ, bạn nên:',
    options: ['Xin lỗi, giải thích rõ, hỗ trợ xử lý', 'Im lặng', 'Trả lời “Bên vận chuyển mà”', 'Đổi sang đơn khác'],
  },
  {
    id: 20,
    question: 'Trong giờ làm, không có khách, bạn sẽ:',
    options: ['Lau chùi quầy, sắp xếp mẫu, học sản phẩm', 'Nghỉ ngơi', 'Dùng điện thoại cá nhân', 'Ra ngoài chơi'],
  },
];

// Short answer questions from the attached guide.  These questions are open‑ended
// and allow the candidate to describe their experience and mindset in detail.
const SHORT_ANSWER_QUESTIONS = [
  { id: 21, question: 'Theo bạn, điều gì làm nên một nhân viên bán hàng tốt?' },
  { id: 22, question: 'Hãy mô tả một tình huống bạn xử lý tốt một khách khó tính.' },
  { id: 23, question: 'Nếu được nhận, bạn sẽ làm gì trong tuần đầu tiên để học việc nhanh nhất?' },
  { id: 24, question: 'Nếu khách trẻ tuổi muốn mua quà cho mẹ, bạn sẽ tư vấn như thế nào?' },
  { id: 25, question: 'Khi khách không chọn được mẫu nào, bạn thường xử lý ra sao?' },
  { id: 26, question: 'Bạn nghĩ đâu là thời điểm nhạy cảm nhất khi tư vấn khách hàng?' },
  { id: 27, question: 'Bạn từng mắc lỗi nào trong lúc làm việc trước đây chưa? Học được gì?' },
  { id: 28, question: 'Theo bạn, nên ưu tiên khách nào khi có đông người vào cùng lúc?' },
  { id: 29, question: 'Bạn thích làm việc độc lập hay theo nhóm? Vì sao?' },
  { id: 30, question: 'Khi có mẫu mới về, bạn sẽ giới thiệu với khách thế nào?' },
  { id: 31, question: 'Nếu một sản phẩm có giá 300k nhưng khách chỉ có 250k, bạn sẽ?' },
  { id: 32, question: 'Bạn nghĩ mình phù hợp nhất với công việc này ở điểm nào?' },
  { id: 33, question: 'Nếu một ngày bị khiển trách, bạn sẽ phản ứng ra sao?' },
  { id: 34, question: 'Khi khách không thích cách livestream của bạn, bạn sẽ điều chỉnh như thế nào?' },
  { id: 35, question: 'Một ngày bán được ít hàng, bạn sẽ cảm thấy thế nào?' },
];

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