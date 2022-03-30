import { Text, DataTable, DataTableRow } from '@lidofinance/lido-ui'
import { FormattedDate } from 'modules/shared/ui/Utils/FormattedDate'
import {
  VotesTitleWrap,
  VotesBarWrap,
  VotesBarNay,
  VotesBarYea,
  ScriptBox,
} from './VoteDetailsStyle'

import { weiToNum, weiToStr } from 'modules/blockChain/utils/parseWei'
import type { Vote } from 'modules/votes/types'

type Props = {
  vote: Vote
}

export function VoteDetails({ vote }: Props) {
  const nayNum = weiToNum(vote.nay)
  const yeaNum = weiToNum(vote.yea)
  const total = nayNum + yeaNum
  const nayPct = total > 0 ? (nayNum / total) * 100 : 0
  const yeaPct = total > 0 ? (yeaNum / total) * 100 : 0

  return (
    <>
      <DataTable>
        <DataTableRow title="Open status">
          {vote.open ? 'Open' : 'Not open'}
        </DataTableRow>

        <DataTableRow title="Execution status">
          {vote.executed ? 'Executed' : 'Not executed'}
        </DataTableRow>

        <DataTableRow title="Start date">
          <FormattedDate
            date={vote.startDate.toNumber()}
            format="MMM DD, YYYY / hh:mm a"
          />
        </DataTableRow>

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
          Nay: {nayNum}{' '}
          <Text as="span" color="secondary" size="xxs">
            ({nayPct.toFixed(2)}%)
          </Text>
        </Text>
        <Text color="text" size="xxs">
          Yay: {yeaNum}{' '}
          <Text as="span" color="secondary" size="xxs">
            ({yeaPct.toFixed(2)}%)
          </Text>
        </Text>
      </VotesTitleWrap>

      <VotesBarWrap>
        <VotesBarNay style={{ width: `${nayPct}%` }} />
        <VotesBarYea style={{ width: `${yeaPct}%` }} />
      </VotesBarWrap>

      <Text color="text" size="xxs">
        Script:
      </Text>

      <ScriptBox value={vote.script} />
    </>
  )
}
