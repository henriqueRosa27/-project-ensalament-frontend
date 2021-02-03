import React, {
  FC,
  createContext,
  useCallback,
  useState,
  ReactNode,
  useContext,
} from 'react';

import RoomModel from '../../models/Room';
import { getRoomById } from '../../services/room';
import { useNotification } from '../Notification';

interface RoomByIdContextData {
  loading: boolean;
  data: RoomModel;
  loadData(id: string): Promise<void>;
}

interface RoomByIdContextProps {
  children: ReactNode;
}

const RoomByIdContext = createContext<RoomByIdContextData>(
  {} as RoomByIdContextData
);

const RoomByIdProvider: FC<RoomByIdContextProps> = ({
  children,
}: RoomByIdContextProps) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RoomModel>({} as RoomModel);
  const { error } = useNotification();

  const loadData = useCallback(async id => {
    try {
      setLoading(true);
      const courseData = await getRoomById(id);
      setData(courseData);
    } catch (e) {
      error('Algo deu errado ao buscar dados');
    } finally {
      setLoading(false);
    }
  }, []);
  return (
    <RoomByIdContext.Provider value={{ loading, loadData, data }}>
      {children}
    </RoomByIdContext.Provider>
  );
};

export function useRoomById(): RoomByIdContextData {
  const context = useContext(RoomByIdContext);

  if (!context) {
    throw new Error('useRoomById must be used within a ListGroupProvider');
  }

  return context;
}

export default RoomByIdProvider;