import DefaultErrorPage from 'next/error';

export default function NotFoundPage() {
  return <DefaultErrorPage statusCode={404} />;
}
