// GetInTouch.jsx
import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import './GetInTouch.scss';
import styles from "@features/Description/description.module.css";
import Rounded from "@Common/RoundedButton/RoundedButton.jsx";
import {motion} from "framer-motion";
import Magnetic from "@Common/Magnetic.jsx";
import Img from '@assets/background.png';
import {Link} from "react-router-dom"; // Replace with your own avatar image
const SERVICE_ID   = 'service_lgiz34k';      // e.g. 'service_xxx'
const TEMPLATE_ID  = 'template_qm5dwbd';     // e.g. 'template_xxx'
const USER_ID      = 'egjMm3GtXTdYX8e3d';         // e.g. 'user_xxx'

const initialFormState = {
  name: '',
  email: '',
  organization: '',
  services: '',
  message: '',
};

export default function GetInTouch() {
  const [formValues, setFormValues] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState({ success: null, message: '' });

  // Simple email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validate(values) {
    const errors = {};

    if (!values.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!values.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(values.email)) {
      errors.email = 'Email is invalid';
    }

    if (!values.organization.trim()) {
      errors.organization = 'Organization is required';
    }

    if (!values.services.trim()) {
      errors.services = 'Please specify which services you need';
    }

    if (!values.message.trim()) {
      errors.message = 'Message is required';
    } else if (values.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }

    return errors;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    // Clear error for the field as user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate(formValues);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setSubmitResult({ success: null, message: '' });

    // Prepare template parameters for EmailJS
    const templateParams = {
      from_name: formValues.name,
      from_email: formValues.email,
      organization: formValues.organization,
      services: formValues.services,
      message: formValues.message,
    };

    emailjs
        .send(SERVICE_ID, TEMPLATE_ID, templateParams, USER_ID)
        .then(
            (response) => {
              console.log('Email sent successfully!', response.status, response.text);
              setSubmitResult({ success: true, message: 'Thank you! Your message has been sent.' });
              setFormValues(initialFormState);
              setIsSubmitting(false);
            },
            (err) => {
              console.error('Email sending failed:', err);
              setSubmitResult({ success: false, message: 'Oops! Something went wrong. Please try again later.' });
              setIsSubmitting(false);
            }
        );
  };

  return (
      <div className='cover'>


      <div className="get-in-touch-wrapper">
        {/* LEFT PANEL: FORM */}
        <div className="left-panel">
          <h1>Let's start a project together</h1>
          <form onSubmit={handleSubmit} noValidate>
            {/* 01. Name */}
            <div className="form-group">
              <label htmlFor="name">01. What's your name?</label>
              <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formValues.name}
                  onChange={handleChange}
              />
              {formErrors.name && <div className="error">{formErrors.name}</div>}
            </div>

            {/* 02. Email */}
            <div className="form-group">
              <label htmlFor="email">02. What's your email?</label>
              <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="john@doe.com"
                  value={formValues.email}
                  onChange={handleChange}
              />
              {formErrors.email && <div className="error">{formErrors.email}</div>}
            </div>

            {/* 03. Organization */}
            <div className="form-group">
              <label htmlFor="organization">03. What's the name of your organization?</label>
              <input
                  type="text"
                  id="organization"
                  name="organization"
                  placeholder="John & Doe Inc."
                  value={formValues.organization}
                  onChange={handleChange}
              />
              {formErrors.organization && <div className="error">{formErrors.organization}</div>}
            </div>

            {/* 04. Services */}
            <div className="form-group">
              <label htmlFor="services">04. What services are you looking for?</label>
              <input
                  type="text"
                  id="services"
                  name="services"
                  placeholder="Web Design, Web Development..."
                  value={formValues.services}
                  onChange={handleChange}
              />
              {formErrors.services && <div className="error">{formErrors.services}</div>}
            </div>

            {/* 05. Message */}
            <div className="form-group">
              <label htmlFor="message">05. Your message</label>
              <textarea
                  id="message"
                  name="message"
                  placeholder="Hello Nam, can you help me with..."
                  value={formValues.message}
                  onChange={handleChange}
              />
              {formErrors.message && <div className="error">{formErrors.message}</div>}
            </div>
            <motion.div className="buttonContainer">
                <Rounded backgroundColor={"#334BD3"} className="button">
                  <p>Get in touch</p>
                </Rounded>
            </motion.div>
            {submitResult.success === true && (
                <div className="success-message">{submitResult.message}</div>
            )}
            {submitResult.success === false && (
                <div className="error-message">{submitResult.message}</div>
            )}
          </form>
        </div>

        {/* RIGHT PANEL: CONTACT INFO + PROFILE IMAGE */}
        <div className="right-panel">
          <div className="profile">
            {/* Replace with your own avatar */}
            <img
                src={Img}
                alt="Profile"
            />
          </div>

          <div className="contact-info">
          <div className="section">
              <h3>Contact Details</h3>
              <Magnetic>
                <p> hoangnamnguyen1707@gmail.com</p>

              </Magnetic>
              <Magnetic><p> +84 966 498 808 </p></Magnetic>
            </div>

            <div className="section">
            <h3>Business Details</h3>
              <p>Hoang Nam</p>
              <p>Location: Ha Noi</p>
            </div>

            <div className="section">
              <h3>Socials</h3>
              <div className="socials">
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
  );
}
