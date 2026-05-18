import type { Metadata } from 'next';
import SignupForm from '@/components/signup/SignupForm';

export const metadata: Metadata = {
  title: 'Get on the list',
};

export default function SignupPage() {
  return <SignupForm />;
}
