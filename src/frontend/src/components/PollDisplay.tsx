import { useState } from 'react';
import { useGetPollResults, useVoteInPoll } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BarChart3 } from 'lucide-react';

interface PollDisplayProps {
  pollId: bigint;
}

export default function PollDisplay({ pollId }: PollDisplayProps) {
  const { data: poll, isLoading } = useGetPollResults(pollId);
  const voteInPoll = useVoteInPoll();
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = async (optionId: bigint) => {
    try {
      await voteInPoll.mutateAsync({ pollId, optionId });
      setHasVoted(true);
    } catch (error) {
      console.error('Vote failed:', error);
    }
  };

  if (isLoading || !poll) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-center text-muted-foreground">Loading poll...</div>
        </CardContent>
      </Card>
    );
  }

  const votesMap = new Map(poll.votes);
  const totalVotes = poll.votes.reduce((sum, [, count]) => sum + Number(count), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="w-5 h-5 text-primary" />
          {poll.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {poll.options.map((option) => {
          const votes = Number(votesMap.get(option.id) || 0);
          const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;

          return (
            <div key={Number(option.id)} className="space-y-2">
              {!hasVoted ? (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleVote(option.id)}
                  disabled={voteInPoll.isPending}
                >
                  {option.text}
                </Button>
              ) : (
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{option.text}</span>
                    <span className="text-muted-foreground">
                      {votes} votes ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              )}
            </div>
          );
        })}
        {hasVoted && (
          <p className="text-xs text-muted-foreground text-center mt-4">
            Total votes: {totalVotes}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
