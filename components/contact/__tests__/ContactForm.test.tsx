import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactFormComponent from '../ContactFormComponent';
import * as contactService from '@/lib/services/contactService';

// Mock the contact service
jest.mock('@/lib/services/contactService', () => ({
  submitContactForm: jest.fn(),
}));

describe('Contact Form Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('user can fill out and submit contact form', async () => {
    const user = userEvent.setup();
    const mockSubmit = contactService.submitContactForm as jest.MockedFunction<typeof contactService.submitContactForm>;
    mockSubmit.mockResolvedValue('mock-doc-id');

    render(<ContactFormComponent />);

    // Fill in the form fields
    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText('Email');
    const messageInput = screen.getByLabelText('Message');

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(messageInput, 'This is a test message for the contact form.');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /send message/i });
    await user.click(submitButton);

    // Verify the service was called with correct data
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message for the contact form.',
      });
    });

    // Verify success message appears
    await waitFor(() => {
      expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
    });

    // Verify form fields are cleared
    expect(nameInput).toHaveValue('');
    expect(emailInput).toHaveValue('');
    expect(messageInput).toHaveValue('');
  });

  test('contact form validates required fields', async () => {
    const user = userEvent.setup();

    render(<ContactFormComponent />);

    // Try to submit empty form
    const submitButton = screen.getByRole('button', { name: /send message/i });
    await user.click(submitButton);

    // HTML5 validation should prevent submission
    // Check that the service was never called
    expect(contactService.submitContactForm).not.toHaveBeenCalled();
  });

  test('displays error message when submission fails', async () => {
    const user = userEvent.setup();
    const mockSubmit = contactService.submitContactForm as jest.MockedFunction<typeof contactService.submitContactForm>;
    mockSubmit.mockRejectedValue(new Error('Network error'));

    render(<ContactFormComponent />);

    // Fill in the form
    await user.type(screen.getByLabelText('Name'), 'Jane Doe');
    await user.type(screen.getByLabelText('Email'), 'jane@example.com');
    await user.type(screen.getByLabelText('Message'), 'Test message');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /send message/i });
    await user.click(submitButton);

    // Verify error message appears
    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });

    // Verify form fields are NOT cleared on error
    expect(screen.getByLabelText('Name')).toHaveValue('Jane Doe');
    expect(screen.getByLabelText('Email')).toHaveValue('jane@example.com');
    expect(screen.getByLabelText('Message')).toHaveValue('Test message');
  });

  test('disables form inputs while submitting', async () => {
    const user = userEvent.setup();
    const mockSubmit = contactService.submitContactForm as jest.MockedFunction<typeof contactService.submitContactForm>;

    // Make the submit function delay to test loading state
    mockSubmit.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve('mock-id'), 100)));

    render(<ContactFormComponent />);

    // Fill in the form
    await user.type(screen.getByLabelText('Name'), 'Test User');
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Message'), 'Test message');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /send message/i });
    await user.click(submitButton);

    // Check that button shows loading state
    expect(screen.getByRole('button', { name: /sending\.\.\./i })).toBeInTheDocument();

    // Check that inputs are disabled
    expect(screen.getByLabelText('Name')).toBeDisabled();
    expect(screen.getByLabelText('Email')).toBeDisabled();
    expect(screen.getByLabelText('Message')).toBeDisabled();

    // Wait for submission to complete
    await waitFor(() => {
      expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
    });
  });
});
