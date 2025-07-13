import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface VehicleContactFormProps {
  vehicleId: string;
  vehicleTitle: string;
}

const VehicleContactForm: React.FC<VehicleContactFormProps> = ({ vehicleId, vehicleTitle }) => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `I'm interested in this ${vehicleTitle} (ID: ${vehicleId}). Please provide more information.`,
    preferredContact: 'email',
    requestType: 'info',
  });
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Simulate API call - in production, replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Success state
      setIsSubmitted(true);
    } catch (err) {
      setError('There was an error submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Dealer</CardTitle>
      </CardHeader>
      <CardContent>
        {isSubmitted ? (
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-success-100 p-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="mb-2 text-lg font-semibold">Thank You!</h3>
            <p className="mb-4 text-neutral-600">
              Your message has been sent successfully. A dealer representative will contact you shortly.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setIsSubmitted(false);
                setFormData({
                  ...formData,
                  message: `I'm interested in this ${vehicleTitle} (ID: ${vehicleId}). Please provide more information.`
                });
              }}
            >
              Send Another Inquiry
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error message */}
            {error && (
              <div className="rounded-md bg-error-50 p-3 text-sm text-error-700">
                {error}
              </div>
            )}
            
            {/* Request Type */}
            <div>
              <label htmlFor="requestType" className="mb-1 block text-sm font-medium text-neutral-700">
                Request Type
              </label>
              <select
                id="requestType"
                name="requestType"
                value={formData.requestType}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-neutral-800 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                required
              >
                <option value="info">Request Information</option>
                <option value="viewing">Schedule Viewing</option>
                <option value="bid">Auction Support</option>
                <option value="offer">Make an Offer</option>
                <option value="docs">Request Documents</option>
              </select>
            </div>
            
            {/* Name */}
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-neutral-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-neutral-800 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                required
              />
            </div>
            
            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-neutral-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-neutral-800 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                required
              />
            </div>
            
            {/* Phone */}
            <div>
              <label htmlFor="phone" className="mb-1 block text-sm font-medium text-neutral-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-neutral-800 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            
            {/* Preferred Contact Method */}
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                Preferred Contact Method
              </label>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="email-contact"
                    name="preferredContact"
                    value="email"
                    checked={formData.preferredContact === 'email'}
                    onChange={handleChange}
                    className="h-4 w-4 border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="email-contact" className="ml-2 block text-sm text-neutral-700">
                    Email
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="phone-contact"
                    name="preferredContact"
                    value="phone"
                    checked={formData.preferredContact === 'phone'}
                    onChange={handleChange}
                    className="h-4 w-4 border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="phone-contact" className="ml-2 block text-sm text-neutral-700">
                    Phone
                  </label>
                </div>
              </div>
            </div>
            
            {/* Message */}
            <div>
              <label htmlFor="message" className="mb-1 block text-sm font-medium text-neutral-700">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-neutral-800 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                required
              />
            </div>
            
            {/* GDPR/Privacy consent */}
            <div className="flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="privacy"
                  name="privacy"
                  type="checkbox"
                  className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="privacy" className="text-neutral-600">
                  I consent to BidVista processing my data to respond to my inquiry in accordance with the{' '}
                  <a href="/privacy-policy" className="text-primary-600 hover:underline">
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>
            </div>
            
            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
        
        {/* Dealer response time */}
        <div className="mt-6 flex items-center justify-center text-xs text-neutral-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Dealers typically respond within 24 hours</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleContactForm;
