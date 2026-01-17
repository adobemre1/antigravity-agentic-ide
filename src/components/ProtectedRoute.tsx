import { Navigate } from 'react-router-dom';
import { useStore } from '../store';
import Spinner from './Spinner';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, isLoadingSession } = useStore();

  if (isLoadingSession) {
    return <Spinner />;
  }

  // TODO: Add refined role check here if needed in future
  if (!session) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
