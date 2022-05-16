import { DataTable, DataTableRow, Text } from '@lidofinance/lido-ui'
import { FormattedDate } from 'modules/shared/ui/Utils/FormattedDate'
import { VoteScript } from '../VoteScript'
import { VoteDetailsCountdown } from '../VoteDetailsCountdown'
import {
  StatusText,
  VotesBarNay,
  VotesBarWrap,
  VotesBarYea,
  VotesTitleWrap,
  TextNay,
  TextYay,
} from './VoteDetailsStyle'

import { Vote, VoteStatus } from 'modules/votes/types'
import { weiToNum, weiToStr } from 'modules/blockChain/utils/parseWei'

type Props = {
  vote: Vote
  status: VoteStatus
  voteTime: number
  isEnded: boolean
}

export function VoteDetails({ status, vote, voteTime, isEnded }: Props) {
  const nayNum = weiToNum(vote.nay)
  const yeaNum = weiToNum(vote.yea)
  const total = nayNum + yeaNum
  const nayPct = total > 0 ? (nayNum / total) * 100 : 0
  const yeaPct = total > 0 ? (yeaNum / total) * 100 : 0

  return (
    <>
      <DataTable>
        <DataTableRow title="Status">
          <StatusText status={status}>{status}</StatusText>
        </DataTableRow>

        <VoteDetailsCountdown
          isEndedBeforeTime={isEnded}
          voteTime={voteTime}
          startDate={vote.startDate.toNumber()}
        />

        <DataTableRow title="Start date">
          <FormattedDate
            date={vote.startDate.toNumber()}
            format="MMM DD, YYYY / hh:mm a"
          />
        </DataTableRow>

        {!isEnded && (
          <DataTableRow title="End date">
            <FormattedDate
              date={vote.startDate.toNumber() + voteTime}
              format="MMM DD, YYYY / hh:mm a"
            />
          </DataTableRow>
        )}

        <DataTableRow title="Support required">
          {weiToStr(vote.supportRequired)}
        </DataTableRow>

        <DataTableRow title="Voting power">
          {weiToStr(vote.votingPower)}
        </DataTableRow>

        <DataTableRow title="Min accept quorum">
          {weiToStr(vote.minAcceptQuorum)}
        </DataTableRow>

        <DataTableRow title="Snapshot block">
          {vote.snapshotBlock.toString()}
        </DataTableRow>
      </DataTable>

      <VotesTitleWrap>
        <Text color="text" size="xxs">
          <TextNay>Nay: {nayNum}</TextNay>{' '}
          <Text as="span" color="secondary" size="xxs">
            ({nayPct.toFixed(2)}%)
          </Text>
        </Text>
        <Text color="text" size="xxs">
          <TextYay>Yay: {yeaNum}</TextYay>{' '}
          <Text as="span" color="secondary" size="xxs">
            ({yeaPct.toFixed(2)}%)
          </Text>
        </Text>
      </VotesTitleWrap>

      <VotesBarWrap>
        <VotesBarNay style={{ width: `${nayPct}%` }} />
        <VotesBarYea style={{ width: `${yeaPct}%` }} />
      </VotesBarWrap>

      <VoteScript script={vote.script} />
    </>
  )
}
