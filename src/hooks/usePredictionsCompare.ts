import { useAtom } from 'jotai';
import { comparePredictionsAtomGroup } from '../state/comparePredictions.atoms';
import { LeaguePredictionRanking } from '../types/fantasyLeagueGroups';

/** Hook that provides predictions compare functions */
export function usePredictionsCompareActions() {
  const [compareMode, setCompareMode] = useAtom(
    comparePredictionsAtomGroup.compareModePredictionsAtom
  );

  const [selectedUsers, setSelectedUsers] = useAtom(comparePredictionsAtomGroup.compareUsersAtom);

  const showCompareModal = () => {
    setCompareMode('modal');
  };

  const closeCompareModal = () => {
    setCompareMode('picking');
  };

  const stopPicking = () => {
    setCompareMode('none');
    setSelectedUsers([]);
  };

  const startPicking = () => {
    setCompareMode('picking');
  };

  const isUserSelectedAlready = (
    user: LeaguePredictionRanking,
    list: LeaguePredictionRanking[]
  ) => {
    return list.some(selectedUser => selectedUser.user_id === user.user_id);
  };

  const addUser = (user: LeaguePredictionRanking) => {
    setSelectedUsers(prev => {
      const doNotAdd = isUserSelectedAlready(user, prev);

      if (doNotAdd) {
        return prev;
      } else {
        return [...prev, user];
      }
    });
  };

  const addOrRemoveUser = (user: LeaguePredictionRanking) => {
    setSelectedUsers(prev => {
      const isAlreadyThere = isUserSelectedAlready(user, prev);

      if (isAlreadyThere) {
        return prev.filter(u => {
          return u.user_id !== user.user_id;
        });
      } else {
        return [...prev, user];
      }
    });
  };

  const addMultipleUsers = (users: LeaguePredictionRanking[]) => {
    setSelectedUsers(prev => {
      const usersNotSelectedAlready = users.filter(u => {
        return !isUserSelectedAlready(u, prev);
      });

      return [...prev, ...usersNotSelectedAlready];
    });
  };

  const removeUser = (user: LeaguePredictionRanking) => {
    setSelectedUsers(prev => prev.filter(u => u.user_id !== user.user_id));
  };

  const getUserIndex = (user: LeaguePredictionRanking) => {
    return selectedUsers.findIndex(u => u.user_id === user.user_id);
  };

  const moveUserLeft = (user: LeaguePredictionRanking) => {
    const index = getUserIndex(user);
    if (index <= 0) return;

    const newArr = [...selectedUsers];
    newArr.splice(index, 1);

    newArr.splice(index - 1, 0, user);

    setSelectedUsers(newArr);
  };

  const moveUserRight = (user: LeaguePredictionRanking) => {
    const index = getUserIndex(user);
    if (index >= selectedUsers.length) return;

    const newArr = [...selectedUsers];
    newArr.splice(index, 1);

    newArr.splice(index + 1, 0, user);

    setSelectedUsers(newArr);
  };

  const clearSelections = () => {
    setSelectedUsers([]);
  };

  return {
    showCompareModal,
    closeCompareModal,
    stopPicking,
    addUser,
    removeUser,
    selectedUsers,
    moveUserLeft,
    moveUserRight,
    compareMode,
    addMultipleUsers,
    startPicking,
    clearSelections,
    isUserSelectedAlready,
    addOrRemoveUser,
  };
}
