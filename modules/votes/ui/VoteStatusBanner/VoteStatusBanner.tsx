import {
  Wrap,
  BannerText,
  InfoText,
  BadgePassed,
  BadgeFailed,
  BadgeOngoing,
} from './VoteStatusBannerStyle'
import { FormattedDate } from 'modules/shared/ui/Utils/FormattedDate'
import { VoteDetailsCountdown } from '../VoteDetailsCountdown'
import ClearIconSVG from 'assets/clear.com.svg.react'
import DoneIconSVG from 'assets/done.com.svg.react'

import { VoteStatus } from 'modules/votes/types'
import { convertStatusToStyledVariant, VoteStatusFontSize } from './types'

type Props = {
  startDate: number
  endDate: number
  voteTime: number
  objectionPhaseTime: number
  isEnded: boolean
  fontSize: VoteStatusFontSize
  status: VoteStatus
}

export function VoteStatusBanner({
  startDate,
  endDate,
  voteTime,
  objectionPhaseTime,
  isEnded,
  fontSize,
  status,
}: Props) {
  const variant = convertStatusToStyledVariant(status)

  const endDateEl = (
    <InfoText variant={variant}>
      <FormattedDate date={endDate} format="DD MMM YYYY, HH:mm" />
    </InfoText>
  )

  return (
    <Wrap fontSize={fontSize} variant={variant}>
      {status === VoteStatus.ActiveMain && (
        <>
          <BadgeOngoing>1</BadgeOngoing>
          <BannerText variant={variant}>Main phase ends in</BannerText>
          <InfoText variant={variant}>
            <VoteDetailsCountdown
              startDate={startDate}
              voteTime={voteTime - objectionPhaseTime}
              isEndedBeforeTime={isEnded}
            />
          </InfoText>
        </>
      )}

      {status === VoteStatus.ActiveObjection && (
        <>
          <BadgeOngoing>2</BadgeOngoing>
          <BannerText variant={variant}>Objection phase ends in</BannerText>
          <InfoText variant={variant}>
            <VoteDetailsCountdown
              startDate={startDate}
              voteTime={voteTime}
              isEndedBeforeTime={isEnded}
            />
          </InfoText>
        </>
      )}

      {status === VoteStatus.Pending && (
        <>
          <BadgePassed>
            <DoneIconSVG />
          </BadgePassed>
          <BannerText variant={variant}>Passed (pending)</BannerText>
          {endDateEl}
        </>
      )}

      {status === VoteStatus.Passed && (
        <>
          <BadgePassed>
            <DoneIconSVG />
          </BadgePassed>
          <BannerText variant={variant}>Passed</BannerText>
          {endDateEl}
        </>
      )}

      {status === VoteStatus.Executed && (
        <>
          <BadgePassed>
            <DoneIconSVG />
          </BadgePassed>
          <BannerText variant={variant}>Passed (enacted)</BannerText>
          {endDateEl}
        </>
      )}

      {status === VoteStatus.Rejected && (
        <>
          <BadgeFailed>
            <ClearIconSVG />
          </BadgeFailed>
          <BannerText variant={variant}>Rejected</BannerText>
          {endDateEl}
        </>
      )}
    </Wrap>
  )
}
