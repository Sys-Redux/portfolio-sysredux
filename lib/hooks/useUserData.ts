import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { User } from '@/lib/types';
import { useAuth } from '@/lib/context/AuthContext';

export function useUserData() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user', user?.uid],
    queryFn: async () => {
      if (!user) return null;

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) return null;

      const data = userDoc.data();
      return {
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as User;
    },
    enabled: !!user,
  });
}