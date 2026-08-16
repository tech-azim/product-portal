import React from 'react';
import Input, { InputProps } from './Input';

export type DateInputProps = Omit<InputProps, 'type'>;

export default function DateInput(props: DateInputProps) {
  return <Input type="date" {...props} />;
}
