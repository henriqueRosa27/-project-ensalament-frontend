import React, {
  FC,
  createContext,
  useCallback,
  useState,
  ReactNode,
  useContext,
} from 'react';

import EnsalamentReponse from '../models/Ensalament';
import EnsalamentData from '../models/GenerateEnsalament';
import Team from '../models/Team';
import { useBuildingDataSelects } from './DataBuildingSelectsContext';
import { useCourseDataSelects } from './DataCourseSelectsContext';
import { generate } from '../services/ensalament';

interface GenerateEnsalamentData {
  data: EnsalamentData;
  getData: (onSucess: () => void) => void;
  moveTeamToNotEnsalated: (teamId: string) => void;
  moveTeamToRoom: (teamId: string, roomId: string) => void;
}

interface GenerateEnsalamentProps {
  children: ReactNode;
}

const GenerateEnsalamentContext = createContext<GenerateEnsalamentData>(
  {} as GenerateEnsalamentData
);

const GenerateEnsalamentProvider: FC<GenerateEnsalamentProps> = ({
  children,
}: GenerateEnsalamentProps) => {
  const [data, setData] = useState<EnsalamentData>({} as EnsalamentData);
  const { childrenSelecteds: roomsIds } = useBuildingDataSelects();
  const { childrenSelecteds: teamsIds } = useCourseDataSelects();

  const converData = (response: EnsalamentReponse): EnsalamentData => {
    const datas = response.data.map(({ rooms, ...building }) => {
      return {
        ...building,
        rooms: rooms.map(({ team, ...room }) => ({
          ...room,
          teams: team ? [team] : [],
        })),
      };
    });
    const newData: EnsalamentData = {
      notEnsalate: response.notEnsalate,
      data: datas,
    };
    return newData;
  };

  const getData = useCallback(
    async onSucess => {
      try {
        console.log(roomsIds, teamsIds);
        const dataResponse = await generate(roomsIds, teamsIds);
        setData(converData(dataResponse));
        onSucess();
      } catch (e) {
        console.log(e);
      }
    },
    [data, roomsIds, teamsIds]
  );

  const getTeamByData = (teamId: string) => {
    return data.data
      .map(({ rooms }) => rooms)
      .flat()
      .map(({ teams }) => teams)
      .flat()
      .find(t => t.id === teamId);
  };

  const moveTeamToNotEnsalated = useCallback(
    teamId => {
      const team = getTeamByData(teamId);

      const newData = data.data.map(({ rooms, ...building }) => ({
        ...building,
        rooms: rooms.map(({ teams, ...room }) => {
          return {
            ...room,
            teams: teams.filter(t => t.id !== teamId),
          };
        }),
      }));

      const notEnsalate = [...data.notEnsalate, team!];

      setData({ notEnsalate, data: newData });
    },
    [data]
  );

  const moveTeamToRoom = useCallback(
    (teamId, roomId) => {
      let team = data.notEnsalate.find(t => t.id === teamId);

      if (!team) {
        team = getTeamByData(teamId);
      }

      const newData = data.data.map(({ rooms, ...building }) => ({
        ...building,
        rooms: rooms.map(({ teams, ...room }) => {
          if (room.id === roomId) teams.push(team!);

          console.log(teams);
          return {
            ...room,
            teams,
          };
        }),
      }));

      const notEnsalate = data.notEnsalate.filter(t => t.id !== teamId);

      setData({ notEnsalate, data: newData });
    },
    [data]
  );

  return (
    <GenerateEnsalamentContext.Provider
      value={{ data, getData, moveTeamToNotEnsalated, moveTeamToRoom }}>
      {children}
    </GenerateEnsalamentContext.Provider>
  );
};

export function useOptionWeekShift(): GenerateEnsalamentData {
  const context = useContext(GenerateEnsalamentContext);

  if (!context) {
    throw new Error('useAuth must be used within a SingUpProviderProps');
  }

  return context;
}

export default GenerateEnsalamentProvider;
