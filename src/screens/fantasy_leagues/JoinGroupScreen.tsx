import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader, XCircle, ArrowLeft } from 'lucide-react';
import { CheckCircle } from 'lucide-react';
import { leagueGroupService } from '../../services/leagueGroupService';
import { IJoinLeagueGroup } from '../../types/leagueGroup';

export default function JoinGroupScreen() {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const navigate = useNavigate();
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [groupName, setGroupName] = useState<string>('');



  const handleJoinGroup = useCallback(async (code: string) => {
    setIsJoining(true);
    setError(null);

    try {
      const joinData: IJoinLeagueGroup = { invite_code: code.toUpperCase() };
      const joinedGroup = await leagueGroupService.joinLeagueGroup(joinData);
      setGroupName(joinedGroup.name);
      setSuccess(true);

      // Redirect to the league after a short delay
      setTimeout(() => {
        navigate(`/league/${joinedGroup.fantasy_league}`);
      }, 2000);
    } catch (error) {
      if ((`${error}`).includes('fantasy_league_id')) {
        setError(
          `You need to join the fantasy league first. Please join the league before joining this group.`
        );
      } else {
        setError('Invalid invite code or you are already a member of this group.');
      }
      console.error('Join group error:', error);
    } finally {
      setIsJoining(false);
    }
  }, [navigate]);

  const handleRetry = () => {
    if (inviteCode) {
      handleJoinGroup(inviteCode);
    }
  };

  const handleGoBack = () => {
    navigate('/leagues');
  };

  useEffect(() => {
    if (inviteCode) {
      handleJoinGroup(inviteCode);
    }
  }, [handleJoinGroup, inviteCode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full">
        {isJoining ? (
          <div className="text-center">
            <Loader className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Joining Group...
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we add you to the group.
            </p>
          </div>
        ) : success ? (
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Successfully Joined!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You've been added to <strong>{groupName}</strong>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Redirecting to the league...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Unable to Join Group
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <div className="flex gap-3">
              <button
                onClick={handleRetry}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={handleGoBack}
                className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-700 dark:text-white py-2 px-4 rounded-md transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <Loader className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Processing Invite...
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we process your invite.
            </p>
          </div>
        )}

        {!isJoining && !success && !error && (
          <button
            onClick={handleGoBack}
            className="mt-6 w-full flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Leagues
          </button>
        )}
      </div>
    </div>
  );
}
