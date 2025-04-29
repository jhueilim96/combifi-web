import { redirect } from 'next/navigation';

export default function NotFound() {
  redirect('https://combifi.app');
  
  // The following code will never run due to the redirect
  // but is kept as a fallback in case the redirect doesn't work
  return null;
}
