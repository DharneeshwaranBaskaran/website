import React from "react";
import { useNavigate } from 'react-router-dom'; 
import withLogoutHandler from "../../components/hoc/withLogouthandler";
function Help() {
  const navigate = useNavigate();
  const handleback = () => {
    navigate("/buyer/homepage");
  }
  const sendEmail = () => {
    window.location.href = "mailto:support@example.com";
  }

  const faqData = [
    {
      question: 'How do I place an order?',
      answer: 'To place an order, follow these steps...',
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept credit cards, PayPal, and more.',
    },
  ];

  return (
    <div className="backgroundcol">
      <>
      <div className="logout-button">
        <button onClick={handleback}className='purple'>Home </button>
      </div>
      <div className="help-page" >
        <div className="faq-section" >
          <h2 data-testid="PRODUCTS:" >Frequently Asked Questions</h2>
          <ul>
            {faqData.map((item, index) => (
              <li key={index} data-testid="faq-item">
                <strong>{item.question}</strong>
                <p>{item.answer}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="contact-section">
          <h2>Contact Customer Support</h2>
          <p>Email: <a href="mailto:support@example.com" onClick={sendEmail}>support@example.com</a></p>
          <p>Phone:9840950950</p>
        </div>
      </div>
      </> 
    </div>
  );
}

export default withLogoutHandler(Help);