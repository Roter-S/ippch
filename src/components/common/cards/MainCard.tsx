import { forwardRef, type ReactNode, type ReactElement, type Ref } from 'react'
import { Card, CardContent } from '@mui/material'

interface MainCardProps {
  border?: boolean
  boxShadow?: boolean
  children?: ReactNode
  content?: boolean
  contentClass?: string
  contentSX?: React.CSSProperties
  darkTitle?: boolean
  secondary?: ReactNode | string | object
  shadow?: string
  sx?: React.CSSProperties
  title?: ReactNode | string | object
}

const MainCard = forwardRef<HTMLDivElement, MainCardProps>(
  (
    {
      border = true,
      boxShadow,
      children,
      content = true,
      contentClass = '',
      contentSX = {},
      darkTitle,
      secondary,
      shadow,
      sx = {},
      ...others
    }: MainCardProps,
    ref: Ref<HTMLDivElement>
  ): ReactElement => {
    return (
      <Card
        ref={ref}
        {...others}
        sx={{
          ...sx,
          border: 'none'
        }}
      >
        {content && (
          <CardContent sx={contentSX} className={contentClass}>
            {children}
          </CardContent>
        )}
        {!content && children}
      </Card>
    )
  }
)

MainCard.displayName = 'MainCard'
export default MainCard
