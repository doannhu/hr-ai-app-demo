import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Welcome component displays two cards for candidates and employers
 * with a clean, modern iOS-style design.
 */
const Welcome = () => {
  const navigate = useNavigate();

  const handleCandidateClick = () => {
    navigate('/candidate');
  };

  const handleEmployerClick = () => {
    navigate('/employer');
  };

  return (
    <div className="welcome-container">
      <div className="welcome-header">
        <h1>Xin chào bạn đến với Vàng & Bạc Hoa Tùng</h1>
        <p className="welcome-subtitle">
          Đây là hệ thống tuyển dụng đánh giá bằng công nghệ AI
        </p>
      </div>
      
      <div className="welcome-cards">
        <div className="welcome-card" onClick={handleCandidateClick}>
          <h2>Ứng viên</h2>
          <p>
            Cảm ơn bạn đã quan tâm và ứng tuyển vào Vàng & Bạc Hoa Tùng!
            <br /><br />
            Để hiểu rõ hơn về cách bạn xử lý tình huống khi làm việc, shop mời bạn hoàn thành bài kiểm tra ứng xử online dưới đây.
          </p>
          <button className="welcome-button candidate">
            Bắt đầu ứng tuyển
          </button>
        </div>

        <div className="welcome-card" onClick={handleEmployerClick}>
          <h2>Nhà tuyển dụng</h2>
          <p>
            Đăng nhập để xem và đánh giá các đơn ứng tuyển từ ứng viên.
            <br /><br />
            Hệ thống AI sẽ hỗ trợ bạn trong việc đánh giá và lựa chọn ứng viên phù hợp nhất.
          </p>
          <button className="welcome-button employer">
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome; 