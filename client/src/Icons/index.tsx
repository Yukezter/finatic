/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { ReactComponent as _Calendar } from '../Assets/Svg/calendar.svg'
import { ReactComponent as _Clock } from '../Assets/Svg/clock.svg'
import { ReactComponent as _Close } from '../Assets/Svg/close.svg'
import { ReactComponent as _Direction } from '../Assets/Svg/direction.svg'
import { ReactComponent as _Economy } from '../Assets/Svg/economy.svg'
import { ReactComponent as _Home } from '../Assets/Svg/home.svg'
import { ReactComponent as _Logo } from '../Assets/Svg/logo.svg'
import { ReactComponent as _Menu } from '../Assets/Svg/menu.svg'
import { ReactComponent as _Production } from '../Assets/Svg/production.svg'
import { ReactComponent as _Search } from '../Assets/Svg/search.svg'
import { ReactComponent as _Tag } from '../Assets/Svg/tag.svg'
import { ReactComponent as _Triangle } from '../Assets/Svg/triangle.svg'
import { ReactComponent as _Unemployment } from '../Assets/Svg/unemployment.svg'
import { ReactComponent as _VeritcalDots } from '../Assets/Svg/vertical-dots.svg'

import { ReactComponent as _MarketsIllustration } from '../Assets/Svg/markets_illustration.svg'
import { ReactComponent as _NewsIllustration } from '../Assets/Svg/news_illustration.svg'

interface IconProps extends React.SVGProps<SVGSVGElement> {
  title?: string
}

const makeIcon = (Component: React.FC<React.SVGProps<SVGSVGElement>>) => {
  return ({ height = 32, width = 32, color = 'inherit', ...props }: IconProps) => (
    <Component
      height={height}
      width={width}
      color={color}
      fill='currentColor'
      display='block'
      {...props}
    />
  )
}

export const CalendarIcon = makeIcon(_Calendar)
export const ClockIcon = makeIcon(_Clock)
export const CloseIcon = makeIcon(_Close)
export const DirectionIcon = makeIcon(_Direction)
export const EconomyIcon = makeIcon(_Economy)
export const HomeIcon = makeIcon(_Home)
export const LogoIcon = makeIcon(_Logo)
export const MenuIcon = makeIcon(_Menu)
export const ProductionIcon = makeIcon(_Production)
export const SearchIcon = makeIcon(_Search)
export const TagIcon = makeIcon(_Tag)
export const TriangleIcon = makeIcon(_Triangle)
export const UnemploymentIcon = makeIcon(_Unemployment)
export const VeritcalDotsIcon = makeIcon(_VeritcalDots)

export const MarketsIllustrationIcon = makeIcon(_MarketsIllustration)
export const NewsIllustrationIcon = makeIcon(_NewsIllustration)

export const MarketDirectionIcon = ({
  value = 1,
  ...props
}: IconProps & { value: number }) => (
  <DirectionIcon
    height={10}
    width={10}
    style={{
      marginRight: 8,
      marginTop: -2,
      color: `var(--${value >= 0 ? 'green' : 'red'})`,
      transform: `rotate(${value >= 0 ? 0 : 180}deg)`,
    }}
    {...props}
  />
)

// interface IconProps extends React.SVGProps<SVGSVGElement> {
//   title?: string
// }

// const Icon = ({ name height = 32, color = 'inherit', ...props }: IconProps) => {
//   const [Component, setIconModule] = React.useState<React.FC<IconProps> | null>(null)

//   React.useEffect(() => {
//     import(`!!@svgr/webpack?-svgo,+titleProp,+ref!../Assets/Svg/${name}.svg`)
//       .then(module => {
//         setIconModule(module.default)
//       })
//       .catch(() => {
//         console.error(`Icon with name: ${name} not found!`)
//       })
//   }, [name])

//   if (!Component) return null
//   return (
//     <Component
//       height={height}
//       color={color}
//       fill='currentColor'
//       display='block'
//       {...props}
//     />
//   )
// }

// export default Icon
