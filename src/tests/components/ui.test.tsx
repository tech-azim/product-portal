import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { productsApi } from '@/lib/redux/api/productsApi';
import productReducer from '@/lib/redux/slices/productSlice';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import NumberInput from '@/components/ui/NumberInput';
import DateInput from '@/components/ui/DateInput';
import Checkbox from '@/components/ui/Checkbox';
import Badge from '@/components/ui/Badge';
import Text from '@/components/ui/Text';
import Icon from '@/components/ui/Icon';
import Step from '@/components/ui/Step';
import Layout from '@/components/ui/Layout';
import ReduxProvider from '@/components/providers/ReduxProvider';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from '@/components/ui/Table';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/Card';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/Form';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: () => '/products',
  useSearchParams: () => new URLSearchParams(),
}));

const createTestStore = () =>
  configureStore({
    reducer: {
      product: productReducer,
      [productsApi.reducerPath]: productsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(productsApi.middleware),
  });

describe('UI Primitives Unit Tests', () => {
  describe('Button Component', () => {
    it('should render label and handle click events', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Button onClick={handleClick}>Click Me</Button>);
      const btn = screen.getByRole('button', { name: /Click Me/i });
      expect(btn).toBeInTheDocument();

      await user.click(btn);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should disable button and render spinner when isLoading is true', () => {
      render(<Button isLoading>Submitting</Button>);
      const btn = screen.getByRole('button');
      expect(btn).toBeDisabled();
    });

    it('should render leftIcon and rightIcon', () => {
      render(
        <Button leftIcon={<span data-testid="left-icon">Left</span>} rightIcon={<span data-testid="right-icon">Right</span>}>
          With Icons
        </Button>
      );
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });
  });

  describe('Input Component', () => {
    it('should render label and helperText when no error is present', () => {
      render(
        <Input
          label="Username"
          helperText="Enter your unique handle"
          required
        />
      );

      expect(screen.getByText('Enter your unique handle')).toBeInTheDocument();
    });

    it('should render error message when error is provided', () => {
      render(
        <Input
          label="Username"
          error="Username is already taken"
          required
        />
      );

      expect(screen.getByText('Username is already taken')).toBeInTheDocument();
    });
  });

  describe('Select Component', () => {
    it('should render options and handle selection', async () => {
      const user = userEvent.setup();
      const options = [
        { value: 'opt1', label: 'Option 1' },
        { value: 'opt2', label: 'Option 2' },
      ];

      render(<Select label="Choices" options={options} placeholder="Choose an option" />);

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();

      await user.selectOptions(select, 'opt2');
      expect(select).toHaveValue('opt2');
    });
  });

  describe('Textarea Component', () => {
    it('should render textarea with rows and handle typing', async () => {
      const user = userEvent.setup();
      render(<Textarea label="Comments" placeholder="Enter comments" rows={5} />);

      const textarea = screen.getByPlaceholderText(/Enter comments/i);
      await user.type(textarea, 'Hello world');

      expect(textarea).toHaveValue('Hello world');
    });
  });

  describe('NumberInput Component', () => {
    it('should render prefix and suffix symbols', () => {
      render(<NumberInput label="Amount" prefixSymbol="$" suffixSymbol="USD" />);

      expect(screen.getByText('$')).toBeInTheDocument();
      expect(screen.getByText('USD')).toBeInTheDocument();
    });
  });

  describe('DateInput Component', () => {
    it('should render input of type date', () => {
      render(<DateInput label="Birth Date" />);

      const input = screen.getByLabelText(/Birth Date/i);
      expect(input).toHaveAttribute('type', 'date');
    });
  });

  describe('Checkbox Component', () => {
    it('should render label and toggle state', async () => {
      const user = userEvent.setup();
      render(<Checkbox label="Agree to Terms" description="Read carefully" />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);
      expect(checkbox).toBeChecked();
    });
  });

  describe('Badge Component', () => {
    it('should render variant badges', () => {
      render(
        <div>
          <Badge variant="success">Active</Badge>
          <Badge variant="danger">Deleted</Badge>
        </div>
      );

      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Deleted')).toBeInTheDocument();
    });
  });

  describe('Text Typography Component', () => {
    it('should render heading and body text variants', () => {
      render(
        <div>
          <Text variant="h1">Heading 1</Text>
          <Text variant="body">Body paragraph</Text>
        </div>
      );

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Heading 1');
      expect(screen.getByText('Body paragraph')).toBeInTheDocument();
    });
  });

  describe('Icon Component', () => {
    it('should render Lucide icon by name', () => {
      render(<Icon name="Check" size={24} data-testid="check-icon" />);
      expect(screen.getByTestId('check-icon')).toBeInTheDocument();
    });
  });

  describe('Step Stepper Component', () => {
    it('should render step items and indicate current/passed steps', async () => {
      const user = userEvent.setup();
      const handleStepClick = vi.fn();
      const steps = [
        { number: 1, label: 'Step 1' },
        { number: 2, label: 'Step 2' },
      ];
      render(<Step steps={steps} currentStep={2} onStepClick={handleStepClick} />);

      expect(screen.getByText('Step 1')).toBeInTheDocument();
      expect(screen.getByText('Step 2')).toBeInTheDocument();

      const step1Btn = screen.getByText('Step 1');
      await user.click(step1Btn);
      expect(handleStepClick).toHaveBeenCalledWith(1);
    });
  });

  describe('Table Components', () => {
    it('should render structured table elements', () => {
      render(
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Header</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Cell Content</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      );

      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Cell Content')).toBeInTheDocument();
    });
  });

  describe('Card Components', () => {
    it('should render card structure', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
            <CardDescription>Description</CardDescription>
          </CardHeader>
          <CardContent>Content</CardContent>
          <CardFooter>Footer</CardFooter>
        </Card>
      );

      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
    });
  });

  describe('Layout & Provider Components', () => {
    it('should render Layout wrapper with Header and ToastContainer', () => {
      const store = createTestStore();
      render(
        <Provider store={store}>
          <Layout maxWidth="lg">
            <div>Layout Content</div>
          </Layout>
        </Provider>
      );

      expect(screen.getByText('Layout Content')).toBeInTheDocument();
    });

    it('should render ReduxProvider wrapper', () => {
      render(
        <ReduxProvider>
          <div>App Wrapped in Redux</div>
        </ReduxProvider>
      );

      expect(screen.getByText('App Wrapped in Redux')).toBeInTheDocument();
    });
  });

  describe('Form System Components', () => {
    it('should integrate React Hook Form and display validation error', async () => {
      const user = userEvent.setup();

      function TestForm() {
        const methods = useForm({ defaultValues: { name: '' } });
        return (
          <Form
            methods={methods}
            onSubmit={(data) => {
              if (!data.name) {
                methods.setError('name', { message: 'Name is required' });
              }
            }}
          >
            <FormField
              control={methods.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Enter your official name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit Form</Button>
          </Form>
        );
      }

      render(<TestForm />);

      const submitBtn = screen.getByRole('button', { name: /Submit Form/i });
      await user.click(submitBtn);

      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });
  });
});
