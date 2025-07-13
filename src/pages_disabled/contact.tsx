import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Layout from '@/components/layout/Layout';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
}

interface FormErrors {
  [key: string]: string;
}

const ContactPage: React.FC = () => {
  const [formValues, setFormValues] = useState<ContactFormValues>({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: 'general',
    message: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };
  
  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formValues.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formValues.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formValues.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formValues.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      // Simulate API call - in production, replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Success state
      setIsSubmitted(true);
    } catch (err) {
      setFormError('There was an error submitting your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setFormValues({
      name: '',
      email: '',
      phone: '',
      company: '',
      subject: 'general',
      message: '',
    });
    setIsSubmitted(false);
    setFormError(null);
    setErrors({});
  };

  return (
    <>
      <Head>
        <title>Contact Us | BidVista</title>
        <meta name="description" content="Get in touch with the BidVista team for sales inquiries, dealer registration assistance, support, or general questions about our B2B vehicle auction platform." />
      </Head>

      <Layout>
        {/* Hero Section */}
        <div className="bg-primary-900 text-white py-12">
          <Container>
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
              <p className="text-white text-lg">
                Have questions or need assistance? Our team is ready to help you.
              </p>
            </div>
          </Container>
        </div>

        <Container className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <div className="bg-white rounded-lg border border-neutral-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">Send Us a Message</h2>
                
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">Thank You!</h3>
                    <p className="text-neutral-600 mb-6">
                      Your message has been received. Our team will get back to you shortly.
                    </p>
                    <Button 
                      {...{
                        variant: "outline",
                        onClick: resetForm,
                        className: "focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:outline-none"
                      } as any}
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {formError && (
                      <div className="p-4 bg-error-50 border border-error-200 rounded-md text-error-700">
                        {formError}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                          Full Name <span className="text-error-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formValues.name}
                          onChange={handleChange}
                          className={`w-full rounded-md shadow-sm border ${
                            errors.name ? 'border-error-500' : 'border-neutral-300'
                          } focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50`}
                        />
                        {errors.name && <p className="mt-1 text-sm text-error-500">{errors.name}</p>}
                      </div>
                      
                      {/* Email */}
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                          Email Address <span className="text-error-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formValues.email}
                          onChange={handleChange}
                          className={`w-full rounded-md shadow-sm border ${
                            errors.email ? 'border-error-500' : 'border-neutral-300'
                          } focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50`}
                        />
                        {errors.email && <p className="mt-1 text-sm text-error-500">{errors.email}</p>}
                      </div>
                      
                      {/* Phone */}
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formValues.phone}
                          onChange={handleChange}
                          className="w-full rounded-md shadow-sm border border-neutral-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                        />
                      </div>
                      
                      {/* Company */}
                      <div>
                        <label htmlFor="company" className="block text-sm font-medium text-neutral-700 mb-1">
                          Company Name
                        </label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formValues.company}
                          onChange={handleChange}
                          className="w-full rounded-md shadow-sm border border-neutral-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                        />
                      </div>
                    </div>
                    
                    {/* Subject */}
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-1">
                        Subject
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formValues.subject}
                        onChange={handleChange}
                        className="w-full rounded-md shadow-sm border border-neutral-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="sales">Sales Information</option>
                        <option value="dealer">Dealer Registration</option>
                        <option value="support">Technical Support</option>
                        <option value="feedback">Feedback</option>
                        <option value="press">Press & Media</option>
                      </select>
                    </div>
                    
                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1">
                        Message <span className="text-error-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formValues.message}
                        onChange={handleChange}
                        className={`w-full rounded-md shadow-sm border ${
                          errors.message ? 'border-error-500' : 'border-neutral-300'
                        } focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50`}
                      ></textarea>
                      {errors.message && <p className="mt-1 text-sm text-error-500">{errors.message}</p>}
                    </div>
                    
                    {/* Privacy Policy */}
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="privacy"
                          name="privacy"
                          type="checkbox"
                          required
                          aria-describedby="privacy-description"
                          className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="privacy" id="privacy-description" className="text-neutral-600">
                          I agree to the processing of my personal data according to the <a href="/privacy" className="text-primary-600 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500 focus:rounded">Privacy Policy</a>
                        </label>
                      </div>
                    </div>
                    
                    {/* Submit Button */}
                    <div>
                      <Button 
                        type="submit" 
                        {...{
                          variant: "default",
                          size: "lg",
                          className: "w-full focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:outline-none",
                          disabled: isSubmitting
                        } as any}
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </>
                        ) : (
                          'Send Message'
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
            
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                {/* Contact Methods */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      title: 'Email Us',
                      icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      ),
                      content: 'contact@bidvista.com',
                      action: 'mailto:contact@bidvista.com'
                    },
                    {
                      title: 'Call Us',
                      icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      ),
                      content: '+49 30 123 45678',
                      action: 'tel:+4930123456789'
                    },
                    {
                      title: 'Live Chat',
                      icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      ),
                      content: 'Available 24/7',
                      action: '#chat'
                    },
                    {
                      title: 'WhatsApp',
                      icon: (
                        <svg className="h-6 w-6" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      ),
                      content: 'Message on WhatsApp',
                      action: 'https://wa.me/4930123456789'
                    }
                  ].map((item, index) => (
                    <a 
                      key={index} 
                      href={item.action}
                      className="flex items-start p-4 rounded-lg border border-neutral-200 bg-white transition-all hover:border-primary-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      aria-label={`${item.title}: ${item.content}`}
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mr-4">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-neutral-900">{item.title}</h3>
                        <p className="text-sm text-primary-600">{item.content}</p>
                      </div>
                    </a>
                  ))}
                </div>
                
                {/* Office Locations */}
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-4">Office Locations</h3>
                  
                  <div className="space-y-4">
                    {[
                      {
                        name: 'Berlin (Headquarters)',
                        address: 'Friedrichstraße 123, 10117 Berlin, Germany',
                        phone: '+49 30 123 45678',
                        email: 'berlin@bidvista.com',
                        mapLink: 'https://maps.google.com'
                      },
                      {
                        name: 'London',
                        address: '123 Oxford Street, London W1D 2HG, United Kingdom',
                        phone: '+44 20 1234 5678',
                        email: 'london@bidvista.com',
                        mapLink: 'https://maps.google.com'
                      },
                      {
                        name: 'Paris',
                        address: '123 Avenue des Champs-Élysées, 75008 Paris, France',
                        phone: '+33 1 23 45 67 89',
                        email: 'paris@bidvista.com',
                        mapLink: 'https://maps.google.com'
                      }
                    ].map((office, index) => (
                      <div key={index} className="border border-neutral-200 rounded-lg p-4 bg-white">
                        <h4 className="font-medium text-neutral-900">{office.name}</h4>
                        <p className="text-sm text-neutral-600 mt-1">{office.address}</p>
                        <div className="mt-2 text-sm text-primary-600">
                          <p>{office.phone}</p>
                          <p>{office.email}</p>
                          <a 
                            href={office.mapLink} 
                            className="text-primary-600 hover:underline text-sm inline-flex items-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:rounded-sm"
                            aria-label={`View ${office.name} office on map`}
                          >
                            View on Map
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Map */}
                <div className="relative w-full h-80 rounded-lg overflow-hidden mb-6">
                  <Image
                    src="/images/contact/map.jpg"
                    alt="Map showing BidVista headquarters location in Berlin, Germany"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button 
                      {...{
                        variant: "default",
                        size: "md",
                        as: "a",
                        href: "https://maps.google.com",
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:outline-none"
                      } as any}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      View on Google Maps
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
        
        {/* FAQ Section */}
        <div className="bg-neutral-50 py-12">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Frequently Asked Questions</h2>
              <p className="text-neutral-600 mb-8">
                Find quick answers to common questions about BidVista
              </p>
              
              <div className="space-y-4 text-left">
                {[
                  {
                    question: 'How do I register as a dealer?',
                    answer: 'To register as a dealer, click on the "Register" button, complete the application form, and submit the required documentation. Our team will review your application and contact you within 1-2 business days.'
                  },
                  {
                    question: 'What are the fees for using BidVista?',
                    answer: 'BidVista charges a buyer\'s premium ranging from 5-10% depending on vehicle value, plus a platform fee of €150 per transaction. Additional services like transport or customs handling have separate fees that are clearly displayed before bidding.'
                  },
                  {
                    question: 'How does vehicle shipping work?',
                    answer: 'After purchasing a vehicle, you can request shipping quotes through our platform from our logistics partners. You can compare prices and services, then book directly. Alternatively, you can arrange your own transportation if preferred.'
                  }
                ].map((item, index) => (
                  <div key={index} className="bg-white rounded-lg border border-neutral-200 p-4">
                    <h3 className="font-medium text-neutral-900 mb-2">{item.question}</h3>
                    <p className="text-sm text-neutral-600">{item.answer}</p>
                  </div>
                ))}
                
                <div className="text-center mt-8">
                  <a href="/faq" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium">
                    View all FAQs
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </Layout>
    </>
  );
};

export default ContactPage;
