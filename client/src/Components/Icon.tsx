/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'

interface IconProps extends React.SVGProps<SVGSVGElement> {
  title?: string
}

const Icon = ({ name, height = 32, color = 'inherit', ...props }: IconProps) => {
  const [Component, setIconModule] = React.useState<React.FC<IconProps> | null>(null)

  React.useEffect(() => {
    import(`!!@svgr/webpack?-svgo,+titleProp,+ref!../Assets/Svg/${name}.svg`)
      .then(module => {
        setIconModule(module.default)
      })
      .catch(() => {
        console.error(`Icon with name: ${name} not found!`)
      })
  }, [name])

  if (!Component) return null
  return (
    <Component
      height={height}
      color={color}
      fill='currentColor'
      display='block'
      {...props}
    />
  )
}

export default Icon
