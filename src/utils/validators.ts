import { FormFieldConfig } from './types';

export const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const validatePhone = (phone: string): boolean => {
    // Exactly 10 digits
    const re = /^\d{10}$/;
    return re.test(phone);
};

export const validatePassword = (password: string): boolean => {
    return password.length >= 6;
};

export const validateDOB = (dob: string): boolean => {
    // Check for YYYY-MM-DD format
    const re = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    if (!re.test(dob)) return false;

    // Check if it's a valid date (e.g., not 2023-02-31)
    const date = new Date(dob);
    return date instanceof Date && !isNaN(date.getTime());
};

export const validateForm = (values: Record<string, string>, fields: FormFieldConfig[]) => {
    const errors: Record<string, string> = {};

    fields.forEach(field => {
        const value = values[field.name];

        if (field.required && (!value || value.trim() === '')) {
            errors[field.name] = `${field.label} is required`;
        } else if (value) {
            if (field.type === 'email' && !validateEmail(value)) {
                errors[field.name] = 'Invalid email address';
            } else if (field.name === 'phone_number' && !validatePhone(value)) {
                errors[field.name] = 'Phone number must be 10 digits';
            } else if (field.name === 'dob' && !validateDOB(value)) {
                errors[field.name] = 'Use YYYY-MM-DD format (e.g. 1998-08-31)';
            } else if (field.type === 'password' && !validatePassword(value)) {
                errors[field.name] = 'Password must be at least 6 characters';
            }
        }
    });

    return errors;
};

export const loginFields: FormFieldConfig[] = [
    {
        name: 'email',
        label: 'Email Address',
        placeholder: 'Enter your email',
        type: 'email',
        icon: 'mail',
        required: true,
        autoCapitalize: 'none',
    },
    {
        name: 'password',
        label: 'Password',
        placeholder: 'Enter your password',
        type: 'password',
        icon: 'lock-closed',
        required: true,
    },
];

export const registerFields: FormFieldConfig[] = [
    {
        name: 'email',
        label: 'Email Address',
        placeholder: 'Enter your email',
        type: 'email',
        icon: 'mail',
        required: true,
        autoCapitalize: 'none',
    },
    {
        name: 'phone_number',
        label: 'Phone Number',
        placeholder: 'Enter 10 digit number',
        type: 'number',
        icon: 'call',
        required: true,
    },
    {
        name: 'dob',
        label: 'Date of Birth',
        placeholder: 'YYYY-MM-DD (e.g. 1998-08-31)',
        type: 'text',
        icon: 'calendar',
        required: true,
    },
    {
        name: 'location',
        label: 'Location',
        placeholder: 'City, Country',
        type: 'text',
        icon: 'location',
        required: true,
    },
    {
        name: 'password',
        label: 'Password',
        placeholder: 'Create a password',
        type: 'password',
        icon: 'lock-closed',
        required: true,
    },
];

export const forgotPasswordFields: FormFieldConfig[] = [
    {
        name: 'email',
        label: 'Email Address',
        placeholder: 'Enter your email',
        type: 'email',
        icon: 'mail',
        required: true,
        autoCapitalize: 'none',
    },
    {
        name: 'password',
        label: 'Password',
        placeholder: 'Enter your password',
        type: 'password',
        icon: 'lock-closed',
        required: true,
    },
    {
        name: 'confirm_password',
        label: 'Confirm Password',
        placeholder: 'Confirm your password',
        type: 'password',
        icon: 'lock-closed',
        required: true,
    },
];
