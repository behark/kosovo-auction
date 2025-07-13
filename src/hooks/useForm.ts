import { useState, useCallback, ChangeEvent, FormEvent } from 'react';

type ValidationRules<T> = {
  [K in keyof T]?: (value: T[K], formValues: T) => string | null;
};

type FormErrors<T> = {
  [K in keyof T]?: string;
};

interface UseFormOptions<T> {
  initialValues: T;
  validationRules?: ValidationRules<T>;
  onSubmit: (values: T, isValid: boolean) => void;
}

/**
 * Custom hook for form state management with validation
 */
export function useForm<T extends Record<string, any>>({
  initialValues,
  validationRules = {},
  onSubmit,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate a single field
  const validateField = useCallback(
    (name: keyof T, value: any): string | null => {
      const validator = validationRules[name];
      if (!validator) return null;
      return validator(value, values);
    },
    [validationRules, values]
  );

  // Validate all fields
  const validateForm = useCallback((): FormErrors<T> => {
    const newErrors: FormErrors<T> = {};
    
    (Object.keys(values) as Array<keyof T>).forEach((key) => {
      const error = validateField(key, values[key]);
      if (error) {
        newErrors[key] = error;
      }
    });
    
    return newErrors;
  }, [validateField, values]);

  // Handle input change
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target as HTMLInputElement;
      const newValue = type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value;
      
      setValues((prev) => ({ ...prev, [name]: newValue }));
      
      setTouched((prev) => ({ ...prev, [name]: true }));
      
      const error = validateField(name as keyof T, newValue);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    },
    [validateField]
  );

  // Handle direct value change (for custom inputs, etc.)
  const setValue = useCallback((name: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, [validateField]);

  // Handle blur event
  const handleBlur = useCallback(
    (name: keyof T) => {
      setTouched((prev) => ({ ...prev, [name]: true }));
      
      const error = validateField(name, values[name]);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    },
    [validateField, values]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      
      setIsSubmitting(true);
      
      // Mark all fields as touched
      const touchedFields = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as Record<keyof T, boolean>
      );
      setTouched(touchedFields);
      
      // Validate all fields
      const formErrors = validateForm();
      setErrors(formErrors);
      
      const isValid = Object.keys(formErrors).length === 0;
      
      // Call onSubmit handler
      await onSubmit(values, isValid);
      
      setIsSubmitting(false);
    },
    [onSubmit, validateForm, values]
  );

  // Reset form to initial values
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({} as Record<keyof T, boolean>);
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setValue,
    resetForm,
  };
}

export default useForm;
