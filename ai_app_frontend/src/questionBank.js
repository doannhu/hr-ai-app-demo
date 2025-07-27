// Multiple choice questions taken from the attached guide.  Each question
// includes a text and four answer options.  Correct answers are not shown to
// the candidate; the selected option letter will be sent to the backend for
// evaluation.
export const MULTIPLE_CHOICE_QUESTIONS = [
  {
    id: 1,
    question: 'Khi khách nói "Giá này mắc quá", bạn nên:',
    options: [
      'Không nói gì, đằng nào khách cũng không mua',
      'Giải thích về chất lượng, mẫu mã tại sao sản phẩm có giá thành đó và chính sách bảo hành',
      'Gật đầu đồng ý, đồng cảm với khách, đợi khách quyết định',
      'Nói khách sản phẩm đúng giá, không bớt được',
    ],
  },
  {
    id: 2,
    question: 'Sản phẩm nào thường dùng làm quà đầy tháng cho bé:',
    options: ['Dây chuyền mặt hoạt hình', 'Vòng bạc, lắc bạc', 'Nhẫn hột dễ thương', 'Bông tai'],
  },
  {
    id: 3,
    question: 'Tình huống nào dưới đây khách hàng không được đổi trong vòng 2 ngày:',
    options: [
      'Khách đeo không hợp, không ưng mẫu, thích mẫu khác hơn. Sản phẩm vẫn nguyên vẹn, bảo quản tốt',
      'Sản phẩm bị sướt nhẹ hoặc móp méo nhẹ.',
      'Khách đeo bị kích tay, muốn đổi size. Sản phẩm vẫn nguyên vẹn, bảo quản tốt',
      'Khách mua làm quà tặng, người tặng muốn đổi món khác. Sản phẩm vẫn nguyên vẹn, bảo quản tốt',
    ],
  },
  {
    id: 4,
    question: 'Khách hàng đến có vẻ chỉ để "xem thử", bạn nên:',
    options: [
      'Không tiếp, đằng nào cũng không mua',
      'Chào hỏi vui vẻ, hỗ trợ, hỏi thăm như khách hàng khác',
      'Kệ khách, tiếp khách có tiềm năng mua hàng trước',
      'Ép mua, chèo kéo khách',
    ],
  },
  {
    id: 5,
    question: 'Lý do chính khiến khách quay lại:',
    options: [
      'Giá cả hợp lí',
      'Hay có chương trình khuyến mãi',
      'Dịch vụ tốt, nhân viên tư vấn nhiệt tình',
      'Có bạn bè làm',
    ],
  },
  {
    id: 6,
    question: 'Nếu bạn làm hỏng/mất sản phẩm, bạn nên:',
    options: [
      'Lặng lẽ, đợi thời điểm thích hợp sẽ nói',
      'Báo ngay quản lí, đồng nghiệp để xử lý',
      'Không phải lỗi mình, là do khách hoặc lí do khác',
      'Tự đền',
    ],
  },
  {
    id: 7,
    question: 'Khách nhắn inbox nhưng chưa trả lời được, bạn nên:',
    options: [
      'Đọc rồi để đó, có thời gian sẽ trả lời một loạt cũng được',
      'Xin phép khách sẽ trả lời sau + ghi nhớ để quay lại',
      'Nhờ người khác, tin tưởng họ đã trả lời rồi',
      'Chặn tin nhắn',
    ],
  },
  {
    id: 8,
    question: 'Khi tư vấn, bạn nên làm gì trước tiên:',
    options: [
      'Hỏi ngân sách trước tiên',
      'Tư vấn xoay quanh về mục đích mua và đối tượng đeo trang sức',
      'Đưa nhiều món cho khách lựa',
      'Đọc tên sản phẩm, giá tiền',
    ],
  },
  {
    id: 9,
    question: 'Đơn hàng online bị giao trễ, bạn nên:',
    options: [
      'Thông báo khách, xin lỗi, giải thích rõ, hỗ trợ xử lý',
      'Im lặng, đợi đến lúc khách nhận hàng rồi mới trả lời',
      'Trả lời "Bên vận chuyển mà không phải lỗi bên em"',
      'Đổi sang đơn khác',
    ],
  },
  {
    id: 10,
    question: 'Trong giờ làm, có những ngày vắng khách, bạn sẽ:',
    options: [
      'Sắp xếp mẫu, học sản phẩm, kiểm tra hàng hoá',
      'Ngồi ngắm cửa hàng, đợi khách tới',
      'Dùng điện thoại cho mục đích cá nhân',
      'Gọi điện thoại, tám chuyện với người yêu, bạn bè',
    ],
  },
];

// Short answer questions from the attached guide.  These questions are open‑ended
// and allow the candidate to describe their experience and mindset in detail.
export const SHORT_ANSWER_QUESTIONS = [
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