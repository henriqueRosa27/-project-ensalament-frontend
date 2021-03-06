import React, {
  FC,
  createContext,
  useCallback,
  useState,
  ReactNode,
  useContext,
} from 'react';

import { updateBuilding } from '../../services/building';
import { useNotification } from '../Notification';

interface BuildingUpdateContextData {
  loading: boolean;
  updateData(id: string, name: string): Promise<void>;
}

interface BuildingUpdateContextProps {
  children: ReactNode;
}

const BuildingUpdateContext = createContext<BuildingUpdateContextData>(
  {} as BuildingUpdateContextData
);

const BuildingUpdateProvider: FC<BuildingUpdateContextProps> = ({
  children,
}: BuildingUpdateContextProps) => {
  const [loading, setLoading] = useState(false);
  const { error, success } = useNotification();

  const updateData = useCallback(async (id, name) => {
    try {
      setLoading(true);
      await updateBuilding(id, name);
      success({ message: 'Prédio alterado com suceso' });
    } catch (e) {
      if (e?.response?.status === 400) {
        error({
          title: 'Dados inválidos',
          message: 'Favor, revalide os dados e tente novamente',
        });
      } else {
        error({
          message: [
            'Ops, algo de errado aconteceu',
            'Tente novamente mais tarde',
          ],
          title: 'Erro inesperado',
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);
  return (
    <BuildingUpdateContext.Provider value={{ loading, updateData }}>
      {children}
    </BuildingUpdateContext.Provider>
  );
};

export function useBuildingUpdate(): BuildingUpdateContextData {
  const context = useContext(BuildingUpdateContext);

  if (!context) {
    throw new Error(
      'useBuildingUpdate must be used within a ListGroupProvider'
    );
  }

  return context;
}

export default BuildingUpdateProvider;
